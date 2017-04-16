/// <reference path="../../../angular.d.ts" />
/// <reference path="../../../models/championship.ts" />


module LPO {
  "use strict";

  export class AwardsController {
    private currentChampionship: Championship;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Mise par défaut sur le premier championnat
      this.currentChampionship = this.contestCentreService.getChampionshipsL1AndEurope()[0];

      // Mise à jour du thème
      this.contestCentreService.setCurrentThemeAndSubTheme('contest.palmares');
    }

    // Sélection d'un championnat
    setChampionship(championship: Championship): void {
      this.currentChampionship = championship;
    }
  }
}
