/// <reference path="../../../angular.d.ts" />
/// <reference path="../../../models/forecaster.ts" />


module LPO {
  "use strict";

  export class ForecasterStatsController {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des statistiques du pronostiqueur
      this.contestCentreService.readForecasterStats().then((data) => {
      });
    }
  }
}