module LPO {
  "use strict";

  export interface IMatchName {
    type: number;
    name: string;
  }

  export class MatchName {
    public static matchNames: Array<IMatchName> = [
      { type: 1, name: "VS"},
      { type: 4, name: "FINALE" },
      { type: 5, name: "COMMUNITY SHIELD" }
    ];
  }

  export enum enumForecastActionCode {
    Pronostics_ScoreEquipeDomicile = 0,
    Pronostics_ScoreEquipeVisiteur = 1,
    Pronostics_ScoreAPEquipeDomicile = 2,
    Pronostics_ScoreAPEquipeVisiteur = 3,
    Pronostics_Vainqueur = 4,
    Pronostics_AjoutButeur = 5,
    Pronostics_SuppressionButeur = 6
  };


}
