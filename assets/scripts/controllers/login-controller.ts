/// <reference path="../angular.d.ts" />


module LPO {
  "use strict";

  export class LoginController {
    private user: string;
    private password: string;

    constructor(private navbarService: NavbarService, private generalService: GeneralService, private $cookies: any, private moment: any) {
      // Lecture des cookies pour voir si le nom d'utilisateur et le mot de passe existent ou non
      this.user = this.$cookies.get("lepoulpedor_login") !== null ? this.$cookies.get("lepoulpedor_login") : "";
      this.password = this.$cookies.get("lepoulpedor_password") !== null ? this.$cookies.get("lepoulpedor_password") : "";
    }

    $onInit() {
      this.navbarService.closeMobileMenu();
      this.navbarService.setMobileMenuTitle("Le Poulpe d'Or");
    }

    public login(): void {
      this.generalService.login(this.user, this.password).then((data: boolean) => {
        // La connexion a réussi
        this.$cookies.put("lepoulpedor_login", this.user, {expires: new Date(this.moment().add(1, 'w'))});
        this.$cookies.put("lepoulpedor_password", this.password, {expires: new Date(this.moment().add(1, 'w'))});
        this.$cookies.putObject("lepoulpedor_user", this.generalService.getUser(), {expires: new Date(this.moment().add(1, 'w'))});

        this.generalService.goToPage("accueil");
      });
    }
  }
}
