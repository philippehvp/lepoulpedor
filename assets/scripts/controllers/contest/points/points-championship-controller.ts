/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class PointsChampionshipController {
    private championship: number;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }
    
    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des points du championnat
      this.contestCentreService.readPoints(this.championship).then((data) => {
      });
    }
  }
}