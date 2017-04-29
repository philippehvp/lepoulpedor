/// <reference path="../../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastPlayersController {
    private playersA: Array<IPlayer>;
    private playersB: Array<IPlayer>;

    constructor(private generalService: GeneralService, private forecastService: ForecastService) {
      this.generalService.checkUser();
    }
  }
}
