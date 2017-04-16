/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastMatchFaceOffController {

    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
    }

    $onInit() {
    }

    public onChange(forecastActionCode: number, matchNumber: number): void {
      this.forecastService.checkExtraAndShootingFaceOff();
      this.forecastService.updateForecast(forecastActionCode);
    }

    public onDeleteScorerFaceOff($index: number, forecastScorer: IForecastScorer, matchFirstOrSecond: number, teamAOrB: number): void {
      this.forecastService.deleteScorerFaceOff($index, forecastScorer, matchFirstOrSecond, teamAOrB);
      this.forecastService.updateForecast(enumForecastActionCode.Pronostics_SuppressionButeur);
    }

    public onAddScorerFaceOff(player: IPlayer, matchFirstOrSecond: number, teamAOrB: number): void {
      this.forecastService.addScorerFaceOff(player, matchFirstOrSecond, teamAOrB);
      this.forecastService.updateForecast(enumForecastActionCode.Pronostics_SuppressionButeur);
    }
  }
}
