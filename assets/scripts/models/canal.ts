module LPO {
  "use strict";

  export interface ICanalData {
    Scores: number;
  }

  export interface ICanal {
    Pronostiqueurs: Array<IForecaster>;
    Donnees: ICanalData[];
  }
}