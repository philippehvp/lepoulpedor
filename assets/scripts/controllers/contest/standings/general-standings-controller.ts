/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class GeneralStandingsController {
    static firstCall: boolean = true;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Mise à jour du thème
      this.contestCentreService.setCurrentThemeAndSubTheme('contest.classements-general');
    }
  }
}
