module LPO {
  "use strict";

  export interface IWinDrawLossData {
    Nombre_Victoires_Pronostiquees: number;
    Nombre_Victoires_Reelles: number;
    Ratio_Victoires: number;
    Nombre_Nuls_Pronostiques: number;
    Nombre_Nuls_Reels: number;
    Ratio_Nuls: number;
    Nombre_Defaites_Pronostiquees: number;
    Nombre_Defaites_Reelles: number;
    Ratio_Defaites: number;
  }

  export interface IWinDrawLoss {
    Pronostiqueurs: Array<IForecaster>;
    Donnees: Array<IWinDrawLossData>;
  }
}