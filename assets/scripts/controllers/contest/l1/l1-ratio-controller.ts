/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class L1RatioController {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des ratio
      this.contestCentreService.readRatio().then((data) => {
      });
    }
  }
}
