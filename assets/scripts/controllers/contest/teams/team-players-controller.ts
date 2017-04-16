/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class TeamPlayersController {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

    }
  }
}