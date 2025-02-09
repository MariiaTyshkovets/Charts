import { Period } from '../enums/periodisity.enum';

export interface IDateRangeRequest {
  instrumentId: string;
  provider: string;
  interval: number;
  periodicity: Period;
  startDate: string;
  endDate: string;
}
