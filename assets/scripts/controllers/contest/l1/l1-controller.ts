/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class L1Controller {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Mise à jour du thème
      this.contestCentreService.setCurrentThemeAndSubTheme('contest.l1');
    }
  }
}
