/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class StandingsWeekController {
    private isFirstWeekSelected: boolean;

    constructor(private navbarService: NavbarService, private generalService: GeneralService, private standingsService: StandingsService) {
      this.isFirstWeekSelected = false;
    }
  }
}
