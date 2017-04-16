module LPO {
  "use strict";

  export interface ITeamPointsTeam {
    Equipes_NomCourt: string;
  }

  export interface ITeamPointsData {
    Scores: number;
  }

  export interface ITeamPoints {
    Pronostiqueurs: Array<IForecaster>;
    Equipes: Array<ITeamPointsTeam>;
    Donnees: Array<ITeamPointsData>;
  }
}