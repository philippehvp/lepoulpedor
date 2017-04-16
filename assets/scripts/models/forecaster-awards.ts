module LPO {
  "use strict";

  export interface IAwardsPoulpeOr {
    Nombre_Journees: number;
    Journees_Journee: string;
  }

  export interface IAwardsPoulpeArgent {
    Nombre_Journees: number;
    Journees_Journee: string;
  }

  export interface IAwardsPoulpeBronze {
    Nombre_Journees: number;
    Journees_Journee: string;
  }

  export interface IAwardsSoulierOr {
    Nombre_Journees: number;
    Journees_Journee: string;
  }

  export interface IAwardsBrandao {
    Nombre_Journees: number;
    Journees_Journee: string;
  }

  export interface IAwardsDjaDjedje {
    Nombre_Journees: number;
    Journees_Journee: string;
  }

  export interface IAwardsRecordPoints {
    Nombre_Journees: number;
    Journees_Journee: string;
  }

  export interface IAwardsRecordPointsButeur {
    Nombre_Journees: number;
    Journees_Journee: string;
  }

  export interface IForecasterAwards {
    Championnats_Nom: string;
    PoulpeOr: IAwardsPoulpeOr;
    PoulpeArgent: IAwardsPoulpeArgent;
    PoulpeBronze: IAwardsPoulpeBronze;
    SoulierOr: IAwardsSoulierOr;
    Brandao: IAwardsBrandao;
    DjaDjedje: IAwardsDjaDjedje;
    RecordPoints: IAwardsRecordPoints;
    RecordPointsButeur: IAwardsRecordPointsButeur;
  }
}