/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class ForecastersController {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }
    $onInit() {
      this.navbarService.closeMobileMenu();

      // Mise à jour du thème
      this.contestCentreService.setCurrentThemeAndSubTheme('contest.pronostiqueurs');

      // Lecture de tous les pronostiqueurs
      this.contestCentreService.readForecastersLight().then((data) => {
        this.contestCentreService.readForecasterId().then((data) => {
        });
      });
    }

    // Sélection d'un pronostiqueur par l'utilisateur
    selectForecaster(forecasterLight: IForecasterLight): void {
      this.contestCentreService.setCurrentForecasterLight(forecasterLight);
      this.contestCentreService.readForecasterId().then((data) => {
      });
    }
  }
}
