module LPO {
  "use strict";

  export interface IStandings {
    Type_Classement: number;
    Classements_Classement: number;
    Journees_Journee: number;
  }

  export interface IForecasterStandings {
    Championnat: number;
    Championnats_Nom: string;
    Nombre_Pronostiqueurs: number;
    Nombre_Journees: number;
    Classements: IStandings[];
    Classement_Min: number;
    Classement_Max: number;
    ClassementButeur_Min: number;
    ClassementButeur_Max: number;
    ClassementJournee_Min: number;
    ClassementJournee_Max: number;
    Nombre_Classements: number;
  }
}