/// <reference path="../angular.d.ts" />



module LPO {
  "use strict";

  export class GeneralService {
    private user: IUser;

    constructor(
      private $http: ng.IHttpService
      , private $q: ng.IQService
      , private navbarService: NavbarService
      , private $state: any
      , private $cookies: any) {
    }

    // Détermination du type d'écran : petit ou non
    // On se base ici sur la résolution mais cette méthode a des limites
    public isSmallScreen(): boolean {
      return (window.innerWidth <= 767);
    }

    // Formatage de la date
    public formatDate(date: string): string {
      let ret: string = null;

      if(date !== null && date !== undefined) {
        let year: string = date.substr(0, 4);
        let month: string = date.substr(5, 2);
        let day: string = date.substr(8, 2);
        let hour: string = date.substr(11, 2);
        let minute: string = date.substr(14, 2);
        ret = day + "/" + month + "/" + year + " " + hour + ":" + minute;
      }

      return ret;
    }

    public goToPage(page: string): void {
      this.$state.go(page);
    }

    public login(user: string, password: string): ng.IPromise<boolean> {
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Lecture des matches de la journée
      let url = "./dist/login.php";

      this.$http({
        method: "POST",
        url: url,
        data: {
          login: user,
          password: password
        }
      }).then((response: { data: Array<IUser> }) => {
        if(response.data.length) {
          this.user = response.data[0];
          def.resolve(true);
        }
        else {
          this.user = null;
          def.resolve(false);
        }
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "general-service login: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    public logout(): void {
      this.user = null;
      this.$cookies.remove("lepoulpedor_user");
      this.goToPage("accueil");
    }

    public checkUser(): void {
      // On regarde si un objet user existe ou non dans les cookies
      // Et on le charge s'il le faut
      let user: IUser = this.$cookies.getObject("lepoulpedor_user");
      if (user !== null && user !== undefined) {
        this.setUser(user);
      }

      // On vérifie que les droits d'accès de l'utilisateur n'ont pas été changés depuis la dernière vérification
      if(this.user !== undefined)
        this.login(this.user.Pronostiqueurs_NomUtilisateur, this.user.Pronostiqueurs_MotDePasse);
    }

    public getUser(): IUser {
      return this.user;
    }

    public setUser(user: IUser): void {
      this.user = user;
    }
  }
}
