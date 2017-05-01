/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastMatchFaceOffController {

    constructor(private generalService: GeneralService, private forecastService: ForecastService, private $rootScope: ng.IRootScopeService) {
      this.generalService.checkUser();
    }

    public onChangeScoreFaceOff(forecastActionCode: number): void {
      this.forecastService.changeScoreFaceOff(forecastActionCode);
      this.$rootScope.$broadcast("content.changed");
    }

    public onClickCurrentFirstMatchCollapsedPlayers(): void {
      this.forecastService.toggleCurrentFirstMatchCollapsedPlayers();
      this.$rootScope.$broadcast("content.changed");
    }

    public onClickCurrentSecondMatchCollapsedPlayers(): void {
      this.forecastService.toggleCurrentSecondMatchCollapsedPlayers();
      this.$rootScope.$broadcast("content.changed");
    }

    public onDeleteScorerFirstMatch($index: number, forecastScorer: IForecastScorer, teamAOrB: number): void {
      this.forecastService.deleteScorerFaceOff($index, forecastScorer, teamAOrB, 0);
      this.$rootScope.$broadcast("content.changed");
    }

    public onDeleteScorerSecondMatch($index: number, forecastScorer: IForecastScorer, teamAOrB: number): void {
      this.forecastService.deleteScorerFaceOff($index, forecastScorer, teamAOrB, 1);
      this.$rootScope.$broadcast("content.changed");
    }

    public onAddScorerFirstMatch(player: IPlayer, teamAOrB: number): void {
      this.forecastService.addScorerFaceOff(player, teamAOrB, 0);
      this.$rootScope.$broadcast("content.changed");
    }

    public onAddScorerSecondMatch(player: IPlayer, teamAOrB: number): void {
      this.forecastService.addScorerFaceOff(player, teamAOrB, 1);
      this.$rootScope.$broadcast("content.changed");
    }
  }
}
