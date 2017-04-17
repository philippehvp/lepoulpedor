/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastMatchNormalController {

    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
    }

    $onInit() {
    }

    public onChange(forecastActionCode: number): void {
      //this.forecastService.checkExtraAndShootingNormal();
      //this.forecastService.updateForecast(forecastActionCode);
    }
  }
}
