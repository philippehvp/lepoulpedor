/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastMatchSingleController {
    private $index: number;
    private forecastScorer: IForecastScorer;
    private teamAOrB: number;

    private displayedTeam: enumDisplayedTeam;

    constructor(private generalService: GeneralService, private forecastService: ForecastService, private $rootScope: ng.IRootScopeService) {
      this.generalService.checkUser();
      this.displayedTeam = enumDisplayedTeam.A;
    }

    public onChangeScoreSingle(forecastActionCode: number): void {
      this.forecastService.changeScoreSingle(forecastActionCode);
      this.$rootScope.$broadcast("content.changed");
    }

    public onClickCurrentSingleMatchCollapsedPlayers(): void {
      this.forecastService.toggleCurrentSingleMatchCollapsedPlayers();
      this.$rootScope.$broadcast("content.changed");
    }

    public onDeleteScorerSingle($index: number, forecastScorer: IForecastScorer, teamAOrB: number, firstOrSecondMatch?: number): void {
      this.forecastService.deleteScorerSingle($index, forecastScorer, teamAOrB);
      this.$rootScope.$broadcast("content.changed");
    }

    public onAddScorerSingle(player: IPlayer, teamAOrB: number): void {
      this.forecastService.addScorerSingle(player, teamAOrB);
      this.$rootScope.$broadcast("content.changed");
    }

    public getDisplayedTeam(): enumDisplayedTeam {
      return this.displayedTeam;
    }

    public setDisplayedTeam(displayedTeam: number): void {
      this.displayedTeam = displayedTeam;
    }
  }
}
