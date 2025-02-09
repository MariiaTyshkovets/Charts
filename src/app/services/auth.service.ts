import { effect, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { IAuthResponse } from '../models/auth-response.model';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { testUser } from '../config/test-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accessToken = signal<string | null>(null);
  public refreshToken = signal<string | null>(null);
  public tokenExpiration = signal<number | null>(null);
  public scope = signal<string | null>(null);
  private refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(private apiService: ApiService) {
    this.loadTokensFromStorage();

    effect(() => {
      if (this.tokenExpiration()) {
        this.scheduleTokenRefresh();
      }
    });
  }

  get token(): string | null {
    return this.accessToken();
  }

  public checkAuthentication(): boolean {
    const token = this.token;
    if (!token) {
      return false;
    }

    const expiration = this.tokenExpiration();
    if (!expiration || Date.now() > expiration) {
      this.logout();
      return false;
    }

    return true;
  }

  public initializeAuthentication(): Observable<IAuthResponse> {
    if (!this.checkAuthentication()) {
      return this.getAuthToken();
    }
    return new Observable<IAuthResponse>();
  }

  getAuthToken(): Observable<IAuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new HttpParams()
      .set('grant_type', testUser.grant_type)
      .set('client_id', testUser.client_id)
      .set('username', testUser.username)
      .set('password', testUser.password);
    return this.apiService
      .post<IAuthResponse>(
        `/identity/realms/fintatech/protocol/openid-connect/token`,
        body.toString(),
        headers
      )
      .pipe(tap((response) => this.storeTokens(response)));
  }

  refreshAuthToken(): Observable<IAuthResponse> {
    const refreshToken = this.refreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    } else {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        Authorization: `Bearer ${this.token}`,
      });

      const body = new HttpParams()
        .set('grant_type', testUser.grant_type)
        .set('refresh_token', refreshToken)
        .set('scope', this.scope() || '')
        .set('client_id', testUser.client_id);

      return this.apiService
        .post<IAuthResponse>(
          '/identity/realms/fintatech/protocol/openid-connect/token',
          body.toString(),
          headers
        )
        .pipe(tap((response) => this.storeTokens(response)));
    }
  }

  private storeTokens(response: IAuthResponse): void {
    const now = Date.now();
    this.accessToken.set(response.access_token);
    this.refreshToken.set(response.refresh_token);
    this.scope.set(response.scope);
    this.tokenExpiration.set(now + response.expires_in * 1000);

    localStorage.setItem('token', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);
    localStorage.setItem(
      'tokenExpiration',
      (now + response.expires_in * 1000).toString()
    );
    localStorage.setItem('scope', response.scope);
  }

  private loadTokensFromStorage(): void {
    this.accessToken.set(localStorage.getItem('token'));
    this.refreshToken.set(localStorage.getItem('refreshToken'));
    const expires_in = localStorage.getItem('tokenExpiration');
    this.tokenExpiration.set(expires_in ? +expires_in : null);
    this.scope.set(localStorage.getItem('scope'));
  }

  logout(): void {
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.tokenExpiration.set(null);
    this.scope.set(null);

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('scope');
    localStorage.removeItem('tokenExpiration');

    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
    }
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
    }

    const expiration = this.tokenExpiration();
    if (!expiration) return;

    const now = Date.now();
    const timeUntilExpiration = expiration - now;
    const refreshTime = timeUntilExpiration - 5 * 60 * 1000; // Оновлення за 5 хв до закінчення

    if (refreshTime > 0) {
      this.refreshTimeoutId = setTimeout(() => {
        this.refreshAuthToken().subscribe();
      }, refreshTime);
    }
  }
}
