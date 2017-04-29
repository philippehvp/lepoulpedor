/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastScorersController {

    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
    }

  }
}
