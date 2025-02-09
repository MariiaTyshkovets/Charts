import { Period } from '../enums/periodisity.enum';

export interface ICountBackRequest {
  instrumentId: string;
  provider: string;
  interval: number;
  periodicity: Period;
  barsCount: number;
}
