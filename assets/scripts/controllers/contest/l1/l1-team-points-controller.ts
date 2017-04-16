/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class L1TeamPointsController {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des ratio
      this.contestCentreService.readTeamPoints().then((data) => {
      });
    }
  }
}
