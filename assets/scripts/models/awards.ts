module LPO {
  "use strict";

  export interface IAwardsData {
    Trophees_CodeTrophee: number;
    Nombre_Trophees: number;
  }

  export interface IAwards {
    Pronostiqueurs: IForecaster;
    Donnees: IAwardsData[];
  }
}