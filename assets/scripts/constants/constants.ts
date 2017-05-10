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

  export enum enumForecastFaceOffActionCode {
    SingleMatchScoreA = 0,
    SingleMatchScoreB = 1,
    SecondMatchScoreA = 2,
    SecondMatchScoreB = 3,
    SecondMatchScoreExtraA = 4,
    SecondMatchScoreExtraB = 5,
    SecondMatchShootingWinner = 6,
    FirstMatchAddScorerA = 7,
    FirstMatchAddScorerB = 8,
    FirstMatchDeleteScorerA = 9,
    FirstMatchDeleteScorerB = 10,
    SecondMatchAddScorerA = 11,
    SecondMatchAddScorerB = 12,
    SecondMatchDeleteScorerA = 13,
    SecondMatchDeleteScorerB = 14
  };

  export enum enumForecastSingleActionCode {
    SingleMatchScoreA = 0,
    SingleMatchScoreB = 1,
    SingleMatchScoreExtraA = 2,
    SingleMatchScoreExtraB = 3,
    SingleMatchShootingWinner = 4,
    SingleMatchAddScorerA = 5,
    SingleMatchAddScorerB = 6,
    SingleMatchDeleteScorerA = 7,
    SingleMatchDeleteScorerB = 8
  };

  export enum enumDisplayedTeam {
    A = 0,
    B = 1
  };

}
