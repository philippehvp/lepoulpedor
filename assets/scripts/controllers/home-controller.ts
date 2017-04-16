/// <reference path="../angular.d.ts" />


module LPO {
  "use strict";

  export class HomeController {
    constructor(private navbarService: NavbarService, private generalService: GeneralService) {
      // Récupérer des données de connexion ne suffit pas, il faut les vérifier
      this.generalService.checkUser();
    }

    $onInit() {
      this.navbarService.closeMobileMenu();
      this.navbarService.setMobileMenuTitle("Le Poulpe d'Or");
    }
  }
}
