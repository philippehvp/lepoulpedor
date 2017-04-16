/// <reference path="../angular.d.ts" />


module LPO {
  "use strict";

  export class NavbarService {
    private isMobileMenuVisible: boolean;
    private title: string;

    constructor() {
      this.isMobileMenuVisible = false;
      this.title = "Le Poulpe d'Or";
    }

    public openMobileMenu() {
      this.isMobileMenuVisible = true;
    }

    public closeMobileMenu() {
      this.isMobileMenuVisible = false;
    }

    public getMobileMenuVisibility(): boolean {
      return this.isMobileMenuVisible;
    }

    public setMobileMenuTitle(title: string): void {
      this.title = title;
    }
  }
}