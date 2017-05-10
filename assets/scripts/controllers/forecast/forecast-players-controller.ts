/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastPlayersController {
    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
    }
  }
}
