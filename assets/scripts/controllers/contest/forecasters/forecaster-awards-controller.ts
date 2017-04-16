/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class ForecasterAwardsController {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture du palmarès du pronostiqueur
      this.contestCentreService.readForecasterAwards().then((data) => {
      });
    }


  }
}