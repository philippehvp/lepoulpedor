module LPO {
  "use strict";

  export interface IStandingType {
      label: string;
      value: number;
  }

  export interface IStanding {
      Saisons_Saison: number;
      Journees_Journee: number;
      Classements_DateReference: string;

      Classements_ClassementGeneralMatch: number;
      Classements_ClassementGeneralButeur: number;

      Classements_PointsGeneralMatch: number;
      Classements_PointsGeneralButeur: number;

      Pronostiqueur: number;
      Pronostiqueurs_NomUtilisateur: string;
      Pronostiqueurs_Photo: string;
  }


  export interface IStandingWeek {
      Saisons_Saison: number;
      Journees_Journee: number;
      Classements_DateReference: string;

      Classements_ClassementJourneeMatch: number;
      Classements_ClassementJourneeButeur: number;

      Classements_PointsJourneeMatch: number;
      Classements_PointsJourneeButeur: number;

      Pronostiqueur: number;
      Pronostiqueurs_NomUtilisateur: string;
      Pronostiqueurs_Photo: string;
  }


  export interface IStandingGoal {
      Saisons_Saison: number;
      Journees_Journee: number;
      Classements_DateReference: string;

      Classements_ClassementGeneralButeur: number;
      Classements_PointsGeneralButeur: number;

      Pronostiqueur: number;
      Pronostiqueurs_NomUtilisateur: string;
      Pronostiqueurs_Photo: string;
  }
}