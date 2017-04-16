/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class ForecasterStandingsSVGController {
    private standings: IForecasterStandings;
    private maxCount: number;
    private static index: number = 0;

    constructor(private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      if(ForecasterStandingsSVGController.index < this.maxCount)
        this.contestCentreService.buildForecasterStandingsGraphic(this.standings, ForecasterStandingsSVGController.index++, false);
    }
  }
}