/// <reference path="../angular.d.ts" />

module LPO {
  "use strict";

  export class StandingsController {
    private isFirstWeekSelected: boolean;

    constructor(private navbarService: NavbarService, private generalService: GeneralService, private standingsService: StandingsService) {
      this.generalService.checkUser();
      this.isFirstWeekSelected = false;
    }

    $onInit() {
      this.navbarService.closeMobileMenu();
      this.navbarService.setMobileMenuTitle("Classements");
    }

    // Sélection d'une saison
    selectSeason(season: ISeason): ng.IPromise<boolean> {
      return this.standingsService.selectSeason(this.isFirstWeekSelected, season);
    }

    // Sélection d'un championnat
    selectChampionship(championship: Championship): ng.IPromise<boolean> {
      return this.standingsService.selectChampionship(this.isFirstWeekSelected, championship);
    }

    // Sélection d'une journée et d'une date de référence
    selectWeek(week: IWeek, referenceDate: Date): ng.IPromise<boolean> {
      return this.standingsService.selectWeek(this.isFirstWeekSelected, week, referenceDate);
    }

    private getStandings(): ng.IPromise<boolean> {
      return this.standingsService.getStandings();
    }

    private getStandingsWeek() : ng.IPromise<boolean> {
      return this.standingsService.getStandingsWeek();
    }

    private getStandingsGoal() : ng.IPromise<boolean> {
      return this.standingsService.getStandingsGoal();
    }

    // Sélection d'un type classement à afficher
    selectStandings(standings: IStandingType): void {
      this.standingsService.selectStandings(standings);
    }
  }
}
