/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastMatchFaceOffController {
    private firstMatchCollapsedPlayers: boolean;
    private secondMatchCollapsedPlayers: boolean;

    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();

      this.firstMatchCollapsedPlayers = null;
      this.secondMatchCollapsedPlayers = null;
    }

    $onInit() {
    }

    public onChangeScoreFaceOff(forecastActionCode: number): void {
      this.forecastService.changeScoreFaceOff(forecastActionCode);
    }

    public onDeleteScorerFaceOff($index: number, forecastScorer: IForecastScorer, matchFirstOrSecond: number, teamAOrB: number): void {
      this.forecastService.deleteScorerFaceOff($index, forecastScorer, matchFirstOrSecond, teamAOrB);
    }

    public onAddScorerFaceOff(player: IPlayer, matchFirstOrSecond: number, teamAOrB: number): void {
      this.forecastService.addScorerFaceOff(player, matchFirstOrSecond, teamAOrB);
    }

    public onClickCurrentFirstMatchCollapsedPlayers(): void {
      this.forecastService.toggleCurrentFirstMatchCollapsedPlayers();
    }

    public onClickCurrentSecondMatchCollapsedPlayers(): void {
      this.forecastService.toggleCurrentSecondMatchCollapsedPlayers();
    }

  }
}
