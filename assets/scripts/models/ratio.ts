module LPO {
  "use strict";

  export interface IRatioWeeks {
    Journees_Journee: number;
    Scores_Match: number;
    Scores_Buteur: number;
  }

  export interface IRatioData {
    Classements_PointsJourneeMatch: number;
    Ratio_Match: number;
    Ratio_Buteur: number;
  }

  export interface IRatio {
    Journees: Array<IRatioWeeks>;
    Donnees: Array<IRatioData>;
    Pronostiqueurs: Array<IForecaster>;
  }

}