/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class ScorersChampionshipController {
    private championship: number;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }
    
    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des buteurs du championnat
      this.contestCentreService.readScorers(this.championship).then((data) => {
      });
    }
  }
}