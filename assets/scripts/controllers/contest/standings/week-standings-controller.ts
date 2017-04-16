/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class WeekStandingsController {
    static firstCall: boolean = true;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Mise à jour du thème
      this.contestCentreService.setCurrentThemeAndSubTheme('contest.classements-journee');
    }
  }
}
