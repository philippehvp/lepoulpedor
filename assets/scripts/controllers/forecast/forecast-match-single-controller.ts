/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastMatchSingleController {

    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
    }

    $onInit() {
    }

    public onChangeScoreSingle(forecastActionCode: number): void {
      this.forecastService.changeScoreSingle(forecastActionCode);
    }

    public onDeleteScorerSingle($index: number, forecastScorer: IForecastScorer, teamAOrB: number): void {
      this.forecastService.deleteScorerSingle($index, forecastScorer, teamAOrB);
    }

    public onAddScorerSingle(player: IPlayer, teamAOrB: number): void {
      this.forecastService.addScorerSingle(player, teamAOrB);
    }

  }
}
