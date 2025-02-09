import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { IInstruments } from '../models/instruments.model';
import { IExchanges } from '../models/exchanges.model';
import { ICountBackRequest } from '../models/count-back-request.model';
import { IBar } from '../models/bar.model';
import { HttpParams } from '@angular/common/http';
import { IDateRangeRequest } from '../models/date-range-request.model';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  constructor(private apiService: ApiService) {}

  getInstruments(): Observable<IInstruments> {
    return this.apiService.get<IInstruments>(
      `/api/instruments/v1/instruments?provider=oanda&kind=forex`
    );
  }

  getProviders(): Observable<string[]> {
    return this.apiService
      .get<{ data: string[] }>(`/api/instruments/v1/providers`)
      .pipe(map((response) => response.data));
  }

  getExchanges(): Observable<IExchanges> {
    return this.apiService
      .get<{ data: IExchanges }>(`/api/instruments/v1/exchanges`)
      .pipe(map((response) => response.data));
  }

  getBarsCountBack(request: ICountBackRequest): Observable<IBar[]> {
    const params = this.toHttpParams({
      instrumentId: request.instrumentId,
      provider: request.provider,
      interval: request.interval,
      periodicity: request.periodicity,
      barsCount: request.barsCount,
    });

    return this.apiService
      .get<{ data: IBar[] }>(
        `/api/bars/v1/bars/count-back`,
        params
      )
      .pipe(map((response) => response.data));
  }

  getBarsDateRange(request: IDateRangeRequest): Observable<IBar[]> {
    const params = this.toHttpParams({
      instrumentId: request.instrumentId,
      provider: request.provider,
      interval: request.interval,
      periodicity: request.periodicity,
      startDate: request.startDate,
      endDate: request.endDate,
    });

    return this.apiService
      .get<{ data: IBar[] }>(
        `/api/bars/v1/bars/count-back`,
        params
      )
      .pipe(map((response) => response.data));
  }

  toHttpParams(params: Record<string, string | number>): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      httpParams = httpParams.set(key, params[key].toString());
    });
    return httpParams;
  }
  
}
