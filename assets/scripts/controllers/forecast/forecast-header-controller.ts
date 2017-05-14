/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastHeaderController {
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

    public getClass(matchLight: IMatchLight): string {
      let ret: string = "";

      switch(Number(matchLight.Matches_EtatPronostic)) {
        case enumMatchState.Over : ret = "btn-default"; break;
        case enumMatchState.Unforecastable: ret = "btn-danger"; break;
        case enumMatchState.Unforecasted: ret = "btn-warning"; break;
        case enumMatchState.Forecasted: ret = "btn-success"; break;
      }

      return ret;
    }
  }
}
