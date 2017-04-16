/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class AwardsChampionshipController {
    private championship: number;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des palmarès du championnat
      this.contestCentreService.readAwards(this.championship).then((data) => {
      });
    }
  }
}