/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class L1CanalController {
    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }
    
    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des points Canal
      this.contestCentreService.readCanal().then((data) => {
      });
    }
  }
}
