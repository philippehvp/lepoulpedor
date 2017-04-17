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
    AllerScoreEquipeDomicile = 0,
    AllerScoreEquipeVisiteur = 1,
    RetourScoreEquipeDomicile = 2,
    RetourScoreEquipeVisiteur = 3,
    RetourScoreAPDomicile = 4,
    RetourScoreAPVisiteur = 5,
    RetourVainqueur = 6,
    AllerAjoutButeurDomicile = 7,
    AllerAjoutButeurVisiteur = 8,
    AllerSuppressionButeurDomicile = 9,
    AllerSuppressionButeurVisiteur = 10,
    RetourAjoutButeurDomicile = 11,
    RetourAjoutButeurVisiteur = 12,
    RetourSuppressionButeurDomicile = 13,
    RetourSuppressionButeurVisiteur = 14
  };
}
