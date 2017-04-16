module LPO {
  "use strict";

  export interface IBestTeamsTeam {
    Equipes_NomCourt: string;
  }

  export interface IBestTeamsData {
    Equipes_NomCourt: string;
    Scores: number;
  }

  export interface IBestTeams {
    Pronostiqueurs: Array<IForecaster>;
    Equipes: Array<IBestTeamsTeam>;
    Donnees: Array<IBestTeamsData>;
  }
}