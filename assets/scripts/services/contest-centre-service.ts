/// <reference path="../angular.d.ts" />
/// <reference path="../models/theme.ts" />
/// <reference path="../models/forecaster.ts" />



module LPO {

  "use strict";

  export enum EnumLeftRight { UNKNOWN = 0, LEFT = 1, RIGHT = 2 };

  export class ContestCentreService {
/**/
    // Thèmes et sous-thèmes
    public themes: Array<Theme>;
    public currentTheme: Theme;
    public currentSubTheme: SubTheme;

    // Championnats
    private championshipsL1AndEurope: Array<IChampionship>;

    // Pronostiqueurs
    public forecastersLight: Array<IForecasterLight>;
    private currentForecasterLight: IForecasterLight;
    private currentForecaster: IForecaster;
    private forecasterAwards: IForecasterAwards[];
    private forecasterStats: Array<IForecasterStats>;
    private forecasterStandings: IForecasterStandings[];

    // Buteurs
    private scorers: Array<IScorers>;
    private currentScorersChampionshipId: number;

    // Palmarès
    private awards: Array<IAwards>;
    private currentAwardsChampionshipId: number;

    // Points
    private points: Array<IPoints>;
    private currentPointsChampionshipId: number;

    // Ligue 1
    private winDrawLoss: IWinDrawLoss;           // Victoires / Nuls / Défaites
    private ratio: IRatio;                       // Ratio
    private teamPoints: ITeamPoints;             // Points par équipe
    private bestTeams: IBestTeams;               // Meilleures équipes
    private canal: ICanal;                       // Canal+

    // Classement général / journée
    private standings: Array<IStanding>;
    private currentStandingsChampionshipId: number;

    // Equipes
    private teamsLight: Array<ITeamLight>;
    private currentTeamLight: ITeamLight;
    private players: Array<IPlayer>;

    constructor(private navbarService: NavbarService, private $http: ng.IHttpService, private $q: ng.IQService, private $state: any, private $window: any, private $timeout: ng.ITimeoutService) {
      this.currentForecasterLight = null;
      this.championshipsL1AndEurope = null;
    }

    // Il faut rafraîchir la vue du sous-thème :
    // - à la sélection d'un nouveau pronostiqueur de l'onglet Pronostiqueurs
    // - à la sélection d'une équipe de l'onglet Equipes
    public refreshSubThemeView(): void {
      switch (this.currentSubTheme.id) {
        case 11: this.readForecasterId().then((data) => { });
          break;
        case 12: this.readForecasterAwards().then((data) => { });
          break;
        case 13: this.readForecasterStats().then((data) => { });
          break;
        case 14: this.readForecasterStandings(true).then((data) => { });
          break;
        case 21:
        case 22:
        case 23: this.readScorers(1).then((data) => { });
          break;
        case 31:
        case 32:
        case 33: this.readAwards(1).then((data) => { });
          break;
        case 41:
        case 42:
        case 43: this.readPoints(1).then((data) => { });
          break;
        case 51: this.readWinDrawLoss().then((data) => { });
          break;
        case 52: this.readRatio().then((data) => { });
          break;
        case 53: this.readTeamPoints().then((data) => { });
          break;
        case 54: this.readBestTeams().then((data) => { });
          break;
        case 55: this.readCanal().then((data) => { });
          break;
        case 81:
        case 82:
        case 83:
        case 84: this.readTeamPlayers().then((data) => { });
          break;
      }
    }

    // Création des menus et sous-menus (thèmes et sous-thèmes)
    public createThemes(): void {
      this.themes = [];
      let theme: Theme = new Theme(1, "Pronostiqueurs", "contest.pronostiqueurs", [
        { "id": 11, "label": "Fiche d'identité", "shortLabel": "Fiche", "link": "contest.pronostiqueurs.fiche", "shortLink": "pronostiqueur-fiche" }
        , { "id": 12, "label": "Palmarès", "shortLabel": "Palmarès", "link": "contest.pronostiqueurs.palmares", "shortLink": "pronostiqueur-palmares" }
        , { "id": 13, "label": "Statistiques", "shortLabel": "Stat", "link": "contest.pronostiqueurs.stats", "shortLink": "pronostiqueur-stats" }
        , { "id": 14, "label": "Classements", "shortLabel": "Classements", "link": "contest.pronostiqueurs.classements", "shortLink": "pronostiqueur-classements" }
      ]);
      this.themes.push(theme);

      theme = new Theme(2, "Buteurs", "contest.buteurs", [
        { "id": 21, "label": "Ligue 1", "shortLabel": "L1", "link": "contest.buteurs.l1", "shortLink": "buteurs-l1" }
        , { "id": 22, "label": "Ligue des Champions", "shortLabel": "LDC", "link": "contest.buteurs.ldc", "shortLink": "buteurs-ldc" }
        , { "id": 23, "label": "Europa League", "shortLabel": "EL", "link": "contest.buteurs.el", "shortLink": "buteurs-el" }
      ]);
      this.themes.push(theme);

      theme = new Theme(3, "Palmarès", "contest.palmares", [
        { "id": 31, "label": "Ligue 1", "shortLabel": "L1", "link": "contest.palmares.l1", "shortLink": "palmares-l1" }
        , { "id": 32, "label": "Ligue des Champions", "shortLabel": "LDC", "link": "contest.palmares.ldc", "shortLink": "palmares-ldc" }
        , { "id": 33, "label": "Europa League", "shortLabel": "EL", "link": "contest.palmares.el", "shortLink": "palmares-el" }
      ]);
      this.themes.push(theme);

      theme = new Theme(4, "Points", "contest.points", [
        { "id": 41, "label": "Ligue 1", "shortLabel": "L1", "link": "contest.points.l1", "shortLink": "points-l1" }
        , { "id": 42, "label": "Ligue des Champions", "shortLabel": "LDC", "link": "contest.points.ldc", "shortLink": "points-ldc" }
        , { "id": 43, "label": "Europa League", "shortLabel": "EL", "link": "contest.points.el", "shortLink": "points-el" }
      ]);
      this.themes.push(theme);

      theme = new Theme(5, "Ligue 1", "contest.l1", [
        { "id": 51, "label": "Victoires / Nuls / Défaites", "shortLabel": "V / N / D", "link": "contest.l1.victoire-nul-defaite", "shortLink": "l1-victoire-nul-defaite" }
        , { "id": 52, "label": "Ratio de points", "shortLabel": "Ratio", "link": "contest.l1.ratio", "shortLink": "l1-ratio" }
        , { "id": 53, "label": "Points par équipe", "shortLabel": "Pts / équipe", "link": "contest.l1.points-equipe", "shortLink": "l1-points-equipe" }
        , { "id": 54, "label": "Meilleures équipes", "shortLabel": "Meill. équipes", "link": "contest.l1.meilleures-equipes", "shortLink": "l1.meilleures-equipes" }
        , { "id": 55, "label": "Match Canal", "shortLabel": "Canal", "link": "contest.l1.canal", "shortLink": "l1.canal" }
      ]);
      this.themes.push(theme);

      theme = new Theme(6, "Classement général", "contest.classements-general", [
        { "id": 61, "label": "Ligue 1", "shortLabel": "L1", "link": "contest.classements-general.l1", "shortLink": "classements-general-l1" }
        , { "id": 62, "label": "Ligue des Champions", "shortLabel": "LDC", "link": "contest.classements-general.ldc", "shortLink": "classements-general-ldc" }
        , { "id": 63, "label": "Europa League", "shortLabel": "EL", "link": "contest.classements-general.el", "shortLink": "classements-general-el" }
      ]);
      this.themes.push(theme);

      theme = new Theme(7, "Classement journée", "contest.classements-journee", [
        { "id": 71, "label": "Ligue 1", "shortLabel": "L1", "link": "contest.classements-journee.l1", "shortLink": "classements-journee-l1" }
        , { "id": 72, "label": "Ligue des Champions", "shortLabel": "LDC", "link": "contest.classements-journee.ldc", "shortLink": "classements-journee-ldc" }
        , { "id": 73, "label": "Europa League", "shortLabel": "EL", "link": "contest.classements-journee.el", "shortLink": "classements-journee-el" }
      ]);
      this.themes.push(theme);

      theme = new Theme(8, "Equipes", "contest.equipes", [
        { "id": 81, "label": "Ligue 1", "shortLabel": "L1", "link": "contest.equipes.l1-sans-europe", "shortLink": "equipes-l1-sans-europe" }
        , { "id": 82, "label": "Ligue 1 match européen", "shortLabel": "L1 Europe", "link": "contest.equipes.l1-europe", "shortLink": "equipes-l1-europe" }
        , { "id": 83, "label": "Ligue des Champions", "shortLabel": "LDC", "link": "contest.equipes.ldc", "shortLink": "equipes-ldc" }
        , { "id": 84, "label": "Europa League", "shortLabel": "EL", "link": "contest.equipes.el", "shortLink": "equipes-el" }
      ]);
      this.themes.push(theme);
    }

    // Sélection par défaut du thème et du sous-thème qui sont passés
    public setCurrentThemeAndSubTheme(link: string, subLink: string = ''): void {
      this.currentTheme = null;

      if(link.length !== 0) {
        for (let i = 0; i < this.themes.length; i++) {
          if (this.themes[i].link == link) {
            this.currentTheme = this.themes[i];
            if (this.currentTheme.subThemes.length) {
              this.currentSubTheme = this.currentTheme.subThemes[0];
              this.navbarService.setMobileMenuTitle(this.currentTheme.label + " - " + this.currentSubTheme.label);
            }
            else
              this.navbarService.setMobileMenuTitle(this.currentTheme.label);

            if (this.currentSubTheme.link != "") {
              this.$state.go(this.currentSubTheme.link);
              this.navbarService.setMobileMenuTitle(this.currentTheme.label + " - " + this.currentSubTheme.label);
            }
            break;
          }
        }
      }
      else {
        for (let i = 0; i < this.themes.length; i++) {
          for(let j = 0; j < this.themes[i].subThemes.length; j++) {
            if (this.themes[i].subThemes[j].link == subLink) {
              this.currentTheme = this.themes[i];
              if (this.currentTheme.subThemes.length) {
                this.currentSubTheme = this.currentTheme.subThemes[j];
                this.navbarService.setMobileMenuTitle(this.currentTheme.label + " - " + this.currentSubTheme.label);
              }
              else
                this.navbarService.setMobileMenuTitle(this.currentTheme.label);

              if (this.currentSubTheme.link != "") {
                this.$state.go(this.currentSubTheme.link);
                this.navbarService.setMobileMenuTitle(this.currentTheme.label + " - " + this.currentSubTheme.label);
              }
              break;
            }
          }
        }
      }



      if (this.currentTheme == null) {
        console.error("Impossible de déterminer le thème et le sous-thème courants");
      }


    }

    // Sélection d'un thème
    public setTheme(theme: Theme): void {
      this.currentTheme = theme;
      if (this.currentTheme.subThemes.length) {
        this.currentSubTheme = this.currentTheme.subThemes[0];
        this.setSubTheme(this.currentSubTheme);
      }
      else {
        // Cas des thèmes sans sous-thèmes : on doit aller sur le lien indiqué pour le thème
        this.currentSubTheme = null;
        if (this.currentTheme.link != "") {
          this.$state.go(this.currentTheme.link);
          this.navbarService.setMobileMenuTitle(this.currentTheme.label);
        }
      }
    }

    // Sélection d'un sous-thème
    public setSubTheme(subTheme: SubTheme): void {
      this.currentSubTheme = subTheme;

      if (this.currentSubTheme.link != "") {
        this.$state.go(this.currentSubTheme.link);
        this.navbarService.setMobileMenuTitle(this.currentTheme.label + " - " + this.currentSubTheme.label);
      }
    }

    // Liste des championnats

    // Ligue 1 et championnats européens
    public getChampionshipsL1AndEurope(): Array<IChampionship> {
      if (this.championshipsL1AndEurope == null) {
        let l1: IChampionship = new Championship(1, "Ligue 1", "L1");
        let ldc: IChampionship = new Championship(2, "Ligue des Champions", "LDC");
        let el: IChampionship = new Championship(3, "Europa League", "EL");

        this.championshipsL1AndEurope = [];
        this.championshipsL1AndEurope.push(l1);
        this.championshipsL1AndEurope.push(ldc);
        this.championshipsL1AndEurope.push(el);
      }
      return this.championshipsL1AndEurope;
    }

    // Sélection d'un pronostiqueur
    public setCurrentForecasterLight(forecasterLight: IForecasterLight): void {
      this.currentForecasterLight = forecasterLight;

      // Action à effectuer selon le sous-thème sélectionné
      this.refreshSubThemeView();
    }

    // Lecture de tous les pronostiqueurs
    public readForecastersLight(): ng.IPromise<Array<IForecasterLight>> {
      let url = "./dist/forecasters.php";

      let def: ng.IDeferred<Array<IForecasterLight>> = this.$q.defer<Array<IForecasterLight>>();

      this.$http({
        method: "POST",
        url: url,
        data: {}
      }).then((response: {data: Array<IForecasterLight>}) => {
        this.forecastersLight = response.data;

        // Sélection d'un pronostiqueur par défaut
        // Par défaut, celui qui est connecté
        // Sinon, le premier de la liste
        // Pour le moment, on prend le premier de la liste
        this.currentForecasterLight = this.forecastersLight[0];

        def.resolve(response.data);

      }, (error) => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readForecastersLight: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Lecture des informations détaillées d'un pronostiqueur
    public readForecasterId(): ng.IPromise<IForecaster> {
      let def: ng.IDeferred<IForecaster> = this.$q.defer<IForecaster>();

      if (this.currentForecasterLight) {
        let url = "./dist/forecaster-id.php";

        this.$http({
          method: "POST",
          url: url,
          data: JSON.stringify({ "pronostiqueur": this.currentForecasterLight.Pronostiqueur })
        }).then((response: {data: IForecaster}) => {
          this.currentForecaster = response.data[0];
          def.resolve(response.data);
        }, function errorCallback(error) {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readForecasterId: Server error";
          console.error(errMsg);
          def.reject(errMsg);
        });
        return def.promise;
      }

      return null;
    }

    // Lecture du palmarès d'un pronostiqueur
    public readForecasterAwards(): ng.IPromise<Array<IForecasterAwards>> {
      let def: ng.IDeferred<Array<IForecasterAwards>> = this.$q.defer<Array<IForecasterAwards>>();

      if (this.currentForecasterLight) {
        let url = "./dist/forecaster-awards.php";

        this.$http({
          method: "POST",
          url: url,
          data: JSON.stringify({ "pronostiqueur": this.currentForecasterLight.Pronostiqueur })
        }).then((response: {data: Array<IForecasterAwards>}) => {
          this.forecasterAwards = response.data;
          def.resolve(response.data);
        }, function errorCallback(error) {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readForecasterAwards: Server error";
          console.error(errMsg);
          def.reject(errMsg);
        });

        return def.promise;
      }

      return null;
    }

    // Liste des palmarès d'un pronostiqueur
    public getForecasterAwards(): Array<IForecasterAwards> {
      return this.forecasterAwards;
    }

    // Lecture des statistiques d'un pronostiqueur
    public readForecasterStats(): ng.IPromise<Array<IForecasterStats>> {
      let def: ng.IDeferred<Array<IForecasterStats>> = this.$q.defer<Array<IForecasterStats>>();

      if (this.currentForecasterLight) {
        let url = "./dist/forecaster-stats.php";

        this.$http({
          method: "POST",
          url: url,
          data: JSON.stringify({ "pronostiqueur": this.currentForecasterLight.Pronostiqueur })
        }).then((response: {data: Array<IForecasterStats>}) => {
          this.forecasterStats = response.data;
          def.resolve(response.data);
        }, function errorCallback(error) {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readForecasterStats: Server error";
          console.error(errMsg);
          def.reject(errMsg);
        });

        return def.promise;
      }

      return null;
    }

    // Liste des statistiques d'un pronostiqueur
    public getForecasterStats(): Array<IForecasterStats> {
      return this.forecasterStats;
    }

    // Lecture des classements d'un pronostiqueur
    public readForecasterStandings(refresh: boolean): ng.IPromise<Array<IForecasterStandings>> {
      let def: ng.IDeferred<Array<IForecasterStandings>> = this.$q.defer<Array<IForecasterStandings>>();

      if (this.currentForecasterLight) {
        let url = "./dist/forecaster-standings.php";

        this.$http({
          method: "POST",
          url: url,
          data: JSON.stringify({ "pronostiqueur": this.currentForecasterLight.Pronostiqueur })
        }).then((response: {data: Array<IForecasterStandings>}) => {
          this.forecasterStandings = response.data;

          // Lorsque la fonction n'est pas appelée pour la première fois, il est nécessaire de rappeler manuellement la fonction de création du graphique
          if (refresh) {
            let index: number = 0;
            this.forecasterStandings.forEach((standings) => {
              this.buildForecasterStandingsGraphic(standings, index++, refresh);
            });
          }
          def.resolve(response.data);

        }, function errorCallback(error) {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readForecasterStandings: Server error";
          console.error(errMsg);
          def.reject(errMsg);
        });

        return def.promise;
      }

      return null;
    }

    // Liste des statistiques d'un pronostiqueur pour les différents championnats
    public getForecasterStandings(): Array<IForecasterStandings> {
      return this.forecasterStandings;
    }

    // Construction du graphique de l'évolution des classements (général et journée)
    public buildForecasterStandingsGraphic(standings: IForecasterStandings, index: number, refresh: boolean): void {
      let d3 = this.$window.d3;

      let svg = d3.select("#svg" + index.toString() + " forecaster-standings-svg svg");

      if (refresh) {
        // Effacement de tous les objets présents dans le graphique
        svg.selectAll("*").remove();
      }

      // Calcul des tailles
      let barGap: number = 3;        // Espace entre deux barres d'une journée
      let weekGap: number = 5;       // Espace entre deux journées

      let countForecasters = Number(standings.Nombre_Pronostiqueurs);
      let weekCounts = standings.Nombre_Journees;
      let totalWidth = $("#svg" + index).width();
      let barWidth = Math.floor(
        (
          totalWidth
          - ((weekCounts - 1) * weekGap)
          - (weekCounts * barGap)
        )
        /
        ((standings.Nombre_Classements - 1) * weekCounts)
      );

      let weekWidth = barWidth * (standings.Nombre_Classements - 1) + (barGap * (standings.Nombre_Classements - 2)) + weekGap;
      let usedWidth = (barWidth * (standings.Nombre_Classements - 1) * weekCounts) + (barGap * weekCounts) + (weekGap * (weekCounts - 1));
      let leftMargin = Math.floor((totalWidth - usedWidth) / 2);
      let totalHeight = Math.floor($("#svg" + index).parent().height() * 0.9);
      let topMargin = (totalHeight / countForecasters) / 2;

      // Fonction d'échelle pour la proportion entre les valeurs et la correspondance en x et y
      let scale = d3.scaleLinear()
        .domain([1, countForecasters])
        .range([0, totalHeight - 1]);

      // Données du classement général et général buteur
      let data = standings.Classements.filter((data) => { return data.Type_Classement == 1 || data.Type_Classement == 2; });

      let classes: string[] = ['general', 'goal', 'week'];
      let barX: number = 0 - (barWidth + weekGap);

      let bars = svg.selectAll('rect').data(data).enter().append('rect');
      let barsAttributes = bars.attr('x', function (d, i) {
        barX += i % 2 == 0 ? weekGap + barWidth : barGap + barWidth;
        return leftMargin + Math.floor(barX);
      })
        .attr('y', function (d) {
          return totalHeight - (((countForecasters - d.Classements_Classement) + 1) * (totalHeight / countForecasters)) + topMargin;
        })
        .attr('height', function (d) {
          return ((countForecasters - d.Classements_Classement) + 1) * (totalHeight / countForecasters);
        })
        .attr('width', barWidth)
        .attr('class', function (d) {
          return classes[d.Type_Classement - 1];
        });

      // Données du classement journée
      let dataWeek = standings.Classements.filter((data) => { return data.Type_Classement == 3; });

      // Dessin de la courbe
      let curveX: number = Math.floor(0 - (weekWidth - barWidth / 2));
      let curveFunction = d3.line()
        .curve(d3.curveCatmullRom.alpha(1))
        .x(function (d, i) {
          curveX += Math.floor(weekWidth);
          return leftMargin + curveX;
        })
        .y(function (d) { return scale(d.Classements_Classement); })
      let curve = svg.append('path');
      let curveAttributes = curve.attr('d', curveFunction(dataWeek)).attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'none');

      // Dessin des points de la courbe
      let circleX: number = Math.floor(0 - (weekWidth - barWidth / 2));
      let circles = svg.selectAll('circle').data(dataWeek).enter().append('circle');
      let circlesAttributes = circles
        .attr('cx', function (d, i) {
          circleX += Math.floor(weekWidth);
          return leftMargin + circleX;
        })
        .attr('cy', function (d) { return scale(d.Classements_Classement); })
        .attr('r', 2);
    }

    // Buteurs

    // Lecture des statistiques sur les buteurs pour un championnat
    public readScorers(championshipId: number): ng.IPromise<Array<IScorers>> {
      // Lecture des championnats Ligue 1 et Europe
      this.getChampionshipsL1AndEurope();

      this.currentScorersChampionshipId = championshipId;

      let url = "./dist/scorers.php";

      let def: ng.IDeferred<Array<IScorers>> = this.$q.defer<Array<IScorers>>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": this.currentScorersChampionshipId })
      }).then((response: {data: Array<IScorers>}) => {
        this.scorers = response.data;
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readScorers: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Liste des statistiques sur les buteurs pour un championnat
    public getScorers(): Array<IScorers> {
      return this.scorers;
    }

    // Palmarès

    // Lecture des palmarès pour un championnat
    public readAwards(championshipId: number): ng.IPromise<Array<IAwards>> {
      // Lecture des championnats Ligue 1 et Europe
      this.getChampionshipsL1AndEurope();

      this.currentAwardsChampionshipId = championshipId;

      let url = "./dist/awards.php";

      let def: ng.IDeferred<Array<IAwards>> = this.$q.defer<Array<IAwards>>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": this.currentAwardsChampionshipId })
      }).then((response: {data: Array<IAwards>}) => {
        this.awards = response.data;
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readAwards: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Liste des palmarès pour un championnat
    public getAwards(): Array<IAwards> {
      return this.awards;
    }

    // Points

    // Lecture des points pour un championnat
    public readPoints(championshipId: number): ng.IPromise<Array<IPoints>> {
      // Lecture des championnats Ligue 1 et Europe
      this.getChampionshipsL1AndEurope();

      this.currentPointsChampionshipId = championshipId;

      if (this.currentPointsChampionshipId == null)
        this.currentPointsChampionshipId = 1;

      let url = "./dist/points.php";

      let def: ng.IDeferred<Array<IPoints>> = this.$q.defer<Array<IPoints>>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": this.currentPointsChampionshipId })
      }).then((response: {data: Array<IPoints>}) => {
        this.points = response.data;
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readPoints: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Liste des points pour un championnat
    public getPoints(): Array<IPoints> {
      return this.points;
    }

    // Ligue 1
    // Lecture des victoires / nuls / défaites
    public readWinDrawLoss(): ng.IPromise<IWinDrawLoss> {
      let url = "./dist/l1-win-draw-loss.php";

      let def: ng.IDeferred<IWinDrawLoss> = this.$q.defer<IWinDrawLoss>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": 1 })
      }).then((response: { data: IWinDrawLoss}) => {
        this.winDrawLoss = response.data;
        def.resolve(response.data);

      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readWinDrawLoss: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Liste des victoires / nuls / défaites
    public getWinDrawLossData(index: number): IWinDrawLossData {
      return this.winDrawLoss != null ? this.winDrawLoss.Donnees[index] : null;
    }

    // Liste des pronostiqueurs
    public getWinDrawLossForecasters(): Array<IForecaster> {
      return this.winDrawLoss != null ? this.winDrawLoss.Pronostiqueurs : null;
    }

    // Lecture des ratio
    public readRatio(): ng.IPromise<IRatio> {
      let url = "./dist/l1-ratio.php";

      let def: ng.IDeferred<IRatio> = this.$q.defer<IRatio>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": 1 })
      }).then((response: {data: IRatio}) => {
        this.ratio = response.data;
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readRatio: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Liste des ratio
    public getRatioData(index: number, weekIndex: number): IRatioData {
      return this.ratio != null ? this.ratio.Donnees[index][weekIndex] : null;
    }

    // Liste des pronostiqueurs
    public getRatioForecasters(): Array<IForecaster> {
      return this.ratio != null ? this.ratio.Pronostiqueurs : null;
    }

    // Liste des journées
    public getRatioWeeks(): Array<IRatioWeeks> {
      return this.ratio != null ? this.ratio.Journees : null;
    }

    // Lecture des points par équipe
    public readTeamPoints(): ng.IPromise<ITeamPoints> {
      let url = "./dist/l1-team-points.php";

      let def: ng.IDeferred<ITeamPoints> = this.$q.defer<ITeamPoints>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": 1 })
      }).then((response: {data: ITeamPoints}) => {
        this.teamPoints = response.data;
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readTeamPoints: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Liste des pronostiqueurs
    public getTeamPointsForecasters(): Array<IForecaster> {
      return this.teamPoints != null ? this.teamPoints.Pronostiqueurs : null;
    }

    // Liste des équipes
    public getTeamPointsTeams(): Array<ITeamPointsTeam> {
      return this.teamPoints != null ? this.teamPoints.Equipes : null;
    }

    // Liste des points par équipe d'un pronostiqueur
    public getTeamPointsData(index: number, teamIndex: number): ITeamPointsData {
      return this.teamPoints != null ? this.teamPoints.Donnees[index][teamIndex] : null;
    }

    // Lecture des meilleures équipes
    public readBestTeams(): ng.IPromise<IBestTeams> {
      let url = "./dist/l1-best-teams.php";

      let def: ng.IDeferred<IBestTeams> = this.$q.defer<IBestTeams>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": 1 })
      }).then((response: {data: IBestTeams}) => {
        this.bestTeams = response.data;
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readBestTeams: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Liste des pronostiqueurs
    public getBestTeamsForecasters(): Array<IForecaster> {
      return this.bestTeams != null ? this.bestTeams.Pronostiqueurs : null;
    }

    // Equipes
    public getBestTeamsTeams(): Array<IBestTeamsTeam> {
      return this.bestTeams != null ? this.bestTeams.Equipes : null;
    }

    // Equipes et scores pour un pronostiqueur
    public getBestTeamsData(index: number, teamIndex: number): IBestTeamsData {
      return this.bestTeams != null ? this.bestTeams.Donnees[index][teamIndex] : null;
    }

    // Lecture des points marqués dans les matches Canal
    public readCanal(): ng.IPromise<ICanal> {
      let url = "./dist/l1-canal.php";

      let def: ng.IDeferred<ICanal> = this.$q.defer<ICanal>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": 1 })
      }).then((response: {data: ICanal}) => {
        this.canal = response.data;
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readCanal: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Liste des pronostiqueurs
    public getCanalForecasters(): Array<IForecaster> {
      return this.canal != null ? this.canal.Pronostiqueurs : null;
    }

    // Liste des points Canal
    public getCanalData(index: number): ICanalData {
      return this.canal != null ? this.canal.Donnees[index] : null;
    }


    // Classement général / journée

    // Lecture de tous les pronostiqueurs
    public readStandingsForecastersLight(championshipId: number): ng.IPromise<Array<IForecasterLight>> {
      let def: ng.IDeferred<Array<IForecasterLight>> = this.$q.defer<Array<IForecasterLight>>();

      this.currentStandingsChampionshipId = championshipId;

      let url = "./dist/standings-forecasters.php";

      this.$http({
        method: "POST",
        url: url,
        data: { "championnat": championshipId}
      }).then((response: {data: Array<IForecasterLight>}) => {
        this.forecastersLight = response.data;

        // Sélection d'un pronostiqueur par défaut
        // Par défaut, celui qui est connecté
        // Sinon, le premier de la liste
        // Pour le moment, on prend le premier de la liste
        this.currentForecasterLight = this.forecastersLight[0];

        def.resolve(response.data);

      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readForecastersLight: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }


    // Lecture du classement général pour un championnat
    public readGeneralStandings(championshipId: number, leftOrRightForecaster: EnumLeftRight, forecaster: IForecasterLight): ng.IPromise<IForecasterStandings> {
      // Lecture des championnats Ligue 1 et Europe
      this.getChampionshipsL1AndEurope();

      this.currentStandingsChampionshipId = championshipId;

      if (this.currentStandingsChampionshipId == null)
        this.currentStandingsChampionshipId = 1;

      let url = "./dist/general-standings.php";

      let def: ng.IDeferred<IForecasterStandings> = this.$q.defer<IForecasterStandings>();

      if(forecaster !== null) {
        this.$http({
          method: "POST",
          url: url,
          data: JSON.stringify({ "championnat": this.currentStandingsChampionshipId, "pronostiqueur": forecaster.Pronostiqueur })
        }).then((response: {data: IForecasterStandings}) => {
          this.buildStandingsGraphic(response.data, leftOrRightForecaster);

          def.resolve(response.data);
        }, function errorCallback(error) {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readGeneralStandings: Server error";
          console.error(errMsg);
          def.reject(errMsg);
        });

        return def.promise;
      }
      else
        return null;
    }

    // Lecture du classement journée pour un championnat
    public readWeekStandings(championshipId: number, leftOrRightForecaster: EnumLeftRight, forecaster: IForecasterLight): ng.IPromise<IForecasterStandings> {
      // Lecture des championnats Ligue 1 et Europe
      this.getChampionshipsL1AndEurope();

      this.currentStandingsChampionshipId = championshipId;

      if (this.currentStandingsChampionshipId == null)
        this.currentStandingsChampionshipId = 1;

      let url = "./dist/week-standings.php";

      let def: ng.IDeferred<IForecasterStandings> = this.$q.defer<IForecasterStandings>();

      if(forecaster !== null) {
        this.$http({
          method: "POST",
          url: url,
          data: JSON.stringify({ "championnat": this.currentStandingsChampionshipId, "pronostiqueur": forecaster.Pronostiqueur })
        }).then((response: {data: IForecasterStandings}) => {
          this.buildStandingsGraphic(response.data, leftOrRightForecaster);

          def.resolve(response.data);
        }, function errorCallback(error) {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readWeekStandings: Server error";
          console.error(errMsg);
          def.reject(errMsg);
        });

        return def.promise;
      }
      else
        return null;
    }

    public buildStandingsGraphic(standings: IForecasterStandings, leftOrRightForecaster: EnumLeftRight) {
      let d3 = this.$window.d3;

      let svg = d3.select(".standings-svg svg");

      // Effacement des objets graphiques du graphique (gauche ou droite)
      let className = leftOrRightForecaster === EnumLeftRight.LEFT ? 'left' : 'right';
      svg.selectAll("rect." + className).remove();

      // Calcul des tailles
      let barGap: number = 1;        // Espace entre deux barres d'une journée
      let weekGap: number = 3;       // Espace entre deux journées
      let countForecasters = Number(standings.Nombre_Pronostiqueurs);
      let weekCounts = standings.Nombre_Journees;
      let totalWidth = $("svg").width();
      let barWidth = Math.floor(
        (
          totalWidth
          - ((weekCounts - 1) * weekGap)
          - (weekCounts * barGap)
        )
        /
        (standings.Nombre_Classements * weekCounts)
      );

      if (barWidth <= 0) {
        alert("Valeur de barWidth : " + barWidth);
        barWidth = 1;
      }



      let weekWidth = barWidth * (standings.Nombre_Classements - 1) + (barGap * (standings.Nombre_Classements - 2)) + weekGap;
      let usedWidth = (barWidth * standings.Nombre_Classements * weekCounts) + (barGap * weekCounts) + ((weekCounts - 1) * weekGap);
      let leftMargin = Math.floor((totalWidth - usedWidth) / 2);
      let totalHeight = Math.floor($("svg").parent().height() * 0.9);
      let topMargin = Math.floor((totalHeight / countForecasters) / 2);

      // Fonction d'échelle pour la proportion entre les valeurs et la correspondance en x et y
      let scale = d3.scaleLinear()
        .domain([1, countForecasters + 1])
        .range([0, totalHeight - 1]);

      // Données du classement général et général buteur
      let data = standings.Classements.filter((data) => { return data.Type_Classement == 1; });
      let barX: number = leftOrRightForecaster === EnumLeftRight.LEFT ? 0 - (barWidth + barGap + barWidth + weekGap) : 0 - (barWidth + weekGap);

      let bars = svg.selectAll('rect.' + className).data(data).enter().append('rect').attr('class', className);
      
      let barsAttributes = bars
        .attr('x', function (d, i) {
          barX += barWidth + barGap + barWidth + weekGap;
          return leftMargin + Math.floor(barX);
        })
        .attr('y', function (d) {
          return totalHeight - (((countForecasters - d.Classements_Classement) + 1) * (totalHeight / countForecasters)) + topMargin;
        })
        .attr('height', function (d) {
          return ((countForecasters - d.Classements_Classement) + 1) * (totalHeight / countForecasters);
        })
        .attr('width', barWidth);
    }


    // Equipes

    public readTeams(championshipId: number, europe: number): ng.IPromise<Array<ITeamLight>> {
      let url = "./dist/teams-championship.php";

      let def: ng.IDeferred<Array<ITeamLight>> = this.$q.defer<Array<ITeamLight>>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "championnat": championshipId, "europe": europe })
      }).then((response: { data: Array<ITeamLight> }) => {
        this.teamsLight = response.data;
        this.players = [];
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readTeams: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Sélection d'un pronostiqueur
    public setCurrentTeamLight(teamLight: ITeamLight): void {
      this.currentTeamLight = teamLight;

      // Action à effectuer selon le sous-thème sélectionné
      this.refreshSubThemeView();
    }

    // Lecture des joueurs d'une équipe
    public readTeamPlayers(): ng.IPromise<Array<IPlayer>> {
      if (this.currentTeamLight) {
        let url = "./dist/team-players.php";

        let def: ng.IDeferred<Array<IPlayer>> = this.$q.defer<Array<IPlayer>>();

        this.$http({
          method: "POST",
          url: url,
          data: JSON.stringify({ "equipe": this.currentTeamLight.Equipe })
        }).then((response: { data: Array<IPlayer> }) => {
          this.players = response.data;
          def.resolve(response.data);
        }, function errorCallback(error) {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "contest-centre-service readTeamPlayers: Server error";
          console.error(errMsg);
          def.reject(errMsg);
        });
        return def.promise;
      }

      return null;
    }
  }
}