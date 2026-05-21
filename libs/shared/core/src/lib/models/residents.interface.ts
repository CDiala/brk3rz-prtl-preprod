export interface StateResponse {
  states: State[];
}

export interface State {
  id: number;
  name: string;
}

export interface LGAResponse {
  lgas: LGA[];
}

export interface LGA {
  id: number;
  stateProvinceId: number;
  name: string;
}
