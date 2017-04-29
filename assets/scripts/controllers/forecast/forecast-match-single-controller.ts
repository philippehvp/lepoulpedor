/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastMatchSingleController {
    private $index: number;
    private forecastScorer: IForecastScorer;
    private teamAOrB: number;

    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
    }

    public onChangeScoreSingle(forecastActionCode: number): void {
      this.forecastService.changeScoreSingle(forecastActionCode);
    }

    public onClickCurrentSingleMatchCollapsedPlayers(): void {
      this.forecastService.toggleCurrentSingleMatchCollapsedPlayers();
    }

    public onDeleteScorerSingle($index: number, forecastScorer: IForecastScorer, teamAOrB: number, firstOrSecondMatch?: number): void {
      this.forecastService.deleteScorerSingle($index, forecastScorer, teamAOrB);
    }

    public onAddScorerSingle(player: IPlayer, teamAOrB: number): void {
      this.forecastService.addScorerSingle(player, teamAOrB);
    }

  }
}
