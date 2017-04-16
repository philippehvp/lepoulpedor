module LPO {
  "use strict";

  export interface IScorers {
    Pronostiqueur: IForecaster;
    Nombre_Pronostics_Buteur: number;
    Nombre_Buteurs_Trouves: number;
    Ratio_Buteur: number;
    Pronostiqueurs_Rival: number;
  }
}