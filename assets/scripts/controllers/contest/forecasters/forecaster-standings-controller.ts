/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class ForecasterStandingsController {
    static firstCall: boolean = true;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      this.contestCentreService.readForecasterStandings(!ForecasterStandingsController.firstCall).then((data) => {
        ForecasterStandingsController.firstCall = false;
      });
    }
  }
}