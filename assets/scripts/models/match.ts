module LPO {
  "use strict";

  export interface ISingleMatch {
    Match: number;
    EquipesDomicile_Equipe: number;
    EquipesVisiteur_Equipe: number;
    EquipesDomicile_Nom: string;
    EquipesVisiteur_Nom: string;
    EquipesDomicile_NomCourt: string;
    EquipesVisiteur_NomCourt: string;
    EquipesDomicile_Fanion: string;
    EquipesVisiteur_Fanion: string;

    Matches_Date: Date;
    Matches_TypeMatch: number;

    Pronostics_ScoreEquipeDomicile: number;
    Pronostics_ScoreEquipeVisiteur: number;
    Pronostics_ScoreAPEquipeDomicile: number;
    Pronostics_ScoreAPEquipeVisiteur: number;
    Pronostics_Vainqueur: string;

    PronosticsLies_ScoreEquipeDomicile: number;
    PronosticsLies_ScoreEquipeVisiteur: number;

    Matches_CoteEquipeDomicile: number;
    Matches_CoteNul: number;
    Matches_CoteEquipeVisiteur: number;

    Matches_PointsQualificationEquipeDomicile: number;
    Matches_PointsQualificationEquipeVisiteur: number;

    Championnats_Championnat: number;
  }

  export interface IMatchFirst {
    Match: number;
    EquipesDomicile_Equipe: number;
    EquipesVisiteur_Equipe: number;
    EquipesDomicile_Nom: string;
    EquipesVisiteur_Nom: string;
    EquipesDomicile_NomCourt: string;
    EquipesVisiteur_NomCourt: string;
    EquipesDomicile_Fanion: string;
    EquipesVisiteur_Fanion: string;

    Matches_Date: Date;

    Pronostics_ScoreEquipeDomicile: number;
    Pronostics_ScoreEquipeVisiteur: number;

    Matches_CoteEquipeDomicile: number;
    Matches_CoteNul: number;
    Matches_CoteEquipeVisiteur: number;

    PronosticsCarreFinal_Coefficient: number;
  }

  export interface IMatchSecond {
    Match: number;
    EquipesDomicile_Equipe: number;
    EquipesVisiteur_Equipe: number;
    EquipesDomicile_Nom: string;
    EquipesVisiteur_Nom: string;
    EquipesDomicile_NomCourt: string;
    EquipesVisiteur_NomCourt: string;
    EquipesDomicile_Fanion: string;
    EquipesVisiteur_Fanion: string;

    Matches_Date: Date;

    Pronostics_ScoreEquipeDomicile: number;
    Pronostics_ScoreEquipeVisiteur: number;
    Pronostics_ScoreAPEquipeDomicile: number;
    Pronostics_ScoreAPEquipeVisiteur: number;
    Pronostics_Vainqueur: string;

    Matches_CoteEquipeDomicile: number;
    Matches_CoteNul: number;
    Matches_CoteEquipeVisiteur: number;

    Matches_PointsQualificationEquipeDomicile: number;
    Matches_PointsQualificationEquipeVisiteur: number;

    PronosticsCarreFinal_Coefficient: number;
  }

  export interface IMatchLight {
    Match: number;
    EquipesDomicile_Sigle: string;
    EquipesVisiteur_Sigle: string;
    EquipesDomicile_Fanion: string;
    EquipesVisiteur_Fanion: string;
    Matches_TypeMatch: number;
  }
}
