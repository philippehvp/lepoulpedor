/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastMatchFaceOffController {

    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
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
  }
}
