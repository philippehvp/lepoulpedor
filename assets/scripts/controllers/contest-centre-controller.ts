/// <reference path="../angular.d.ts" />
/// <reference path="../models/season.ts" />
/// <reference path="../models/championship.ts" />
/// <reference path="../models/week.ts" />
/// <reference path="../models/standing.ts" />
/// <reference path="../models/theme.ts" />



module LPO {
  "use strict";

  export class ContestCentreController {
    constructor(private navbarService: NavbarService, private generalService: GeneralService, private contestCentreService: ContestCentreService) {
      this.generalService.checkUser();
    }

    $onInit() {
      this.navbarService.closeMobileMenu();
      this.contestCentreService.createThemes();
    }
  }
}
