/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastController {
    public isBarShown: number = 1;

    constructor(private navbarService: NavbarService, private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
      this.forecastService.initCurrentMatches();
    }

    $onInit() {
      this.navbarService.closeMobileMenu();
      this.navbarService.setMobileMenuTitle("Pronostics");

      // Lecture des journées à pronostiquer
      this.forecastService.readWeeks().then((data) => {
      });
    }

    public selectChampionshipAndWeek(championshipAndWeek: IChampionshipAndWeek): ng.IPromise<Array<IMatchLight>> {
      this.forecastService.setCurrentChampionshipAndWeek(championshipAndWeek);
      return this.forecastService.readMatchesLight(championshipAndWeek);
    }

    public selectMatchLight(matchLight: IMatchLight): void {
      this.forecastService.selectMatchLight(matchLight);
    }
  }
}
