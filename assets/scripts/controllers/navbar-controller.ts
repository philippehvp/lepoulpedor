/// <reference path="../angular.d.ts" />
/// <reference path="../services/navbar-service.ts" />


module LPO {
  "use strict";

  export class NavbarController {
    constructor(private navbarService: NavbarService, private generalService: GeneralService) {
      this.closeMobileMenu();
    }

    private closeMobileMenu() {
      this.navbarService.closeMobileMenu();
    }

    private openMobileMenu() {
      this.navbarService.openMobileMenu();
    }

    private getMobileMenuVisibility(): boolean {
      return this.navbarService.getMobileMenuVisibility();
    }
  }
}
