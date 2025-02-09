import { Period } from '../enums/periodisity.enum';

export interface ITimeBackRequest {
  nstrumentId: string;
  provider: string;
  interval: number;
  periodicity: Period;
  timeBack: string;
}
