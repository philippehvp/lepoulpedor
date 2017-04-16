/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class L1WinDrawLossController {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }
    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des victoires / nuls et défaites
      this.contestCentreService.readWinDrawLoss().then((data) => {
      });
    }
  }
}
