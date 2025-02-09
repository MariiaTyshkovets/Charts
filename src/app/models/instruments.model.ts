export interface IInstruments {
  paging: IPaging;
  data: IInstrument[];
}

export interface IPaging {
  page: number;
  pages: number;
  items: number;
}

export interface IInstrument {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: {
    'active-tick': IMapping;
    simulation: IMapping;
    oanda: IMapping;
  };
  profile: {
    name: string;
    gics: object;
  };
}

export interface IMapping {
  symbol: string;
  exchange: string;
  defaultOrderSize: number;
  tradingHours: {
    regularStart: string;
    regularEnd: string;
    electronicStart: string;
    electronicEnd: string;
  };
}
