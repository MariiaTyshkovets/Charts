import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api_url = environment.proxy_url;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: HttpParams): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    let httpParams = new HttpParams();
    if (params) {
      httpParams = params;
    }
    return this.http
      .get<T>(`${this.api_url}${path}`, { headers, params: httpParams })
      .pipe(catchError((error) => this.formatErrors(error)));
  }

  post<T>(path: string, body: string, httpHeaders: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(`${this.api_url}${path}`, body, { headers: httpHeaders })
      .pipe(catchError((error) => this.formatErrors(error)));
  }

  private formatErrors(error: string) {
    return throwError(() => error);
  }
}
