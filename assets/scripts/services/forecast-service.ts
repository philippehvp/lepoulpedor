/// <reference path="../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastService {
    private championshipsAndWeeks: Array<IChampionshipAndWeek>;
    private currentChampionshipAndWeek: IChampionshipAndWeek;
    private matchesLight: Array<IMatchLight>;
    private currentMatchLight: IMatchLight;
    private currentMatch: IMatch;
    private currentFirstMatch: IMatchFirst;
    private currentSecondMatch: IMatchSecond;

    // Pronostic de buteur
    private currentFirstMatchScorersA: Array<IForecastScorer>;
    private currentFirstMatchScorersB: Array<IForecastScorer>;
    private currentSecondMatchScorersA: Array<IForecastScorer>;
    private currentSecondMatchScorersB: Array<IForecastScorer>;

    // Joueurs
    private currentFirstMatchPlayersA: Array<IPlayer>;
    private currentFirstMatchPlayersB: Array<IPlayer>;
    private currentSecondMatchPlayersA: Array<IPlayer>;
    private currentSecondMatchPlayersB: Array<IPlayer>;

    private matchNormalLimitDateLabel: string;
    private matchFirstLimitDateLabel: string;
    private matchSecondLimitDateLabel: string;

    private scores: Array<number>;
    private scoresExtraA: Array<number>;
    private scoresExtraB: Array<number>;

    private displayScoresExtra: boolean;
    private displayShooting: boolean;

    constructor(private navbarService: NavbarService, private generalService: GeneralService, private $http: ng.IHttpService, private $q: ng.IQService, private $state: any, private moment: any) {
      this.generalService.checkUser();
      this.scores = [];
      for(let i: number = 0; i <= 15; i++)
        this.scores.push(i);

      this.displayScoresExtra = this.displayShooting = false;
    }

    public getScores(): Array<number> {
      return this.scores;
    }

    public getScoresExtraA(): Array<number> {
      return this.scoresExtraA;
    }

    public getScoresExtraB(): Array<number> {
      return this.scoresExtraB;
    }

    public getDateAndMaxDateDifferent(): boolean {
      let ret: boolean = false;
      if(this.currentMatchLight !== undefined)
        if(this.currentMatchLight.Matches_TypeMatch == 2)
          ret = true;

      return ret;
    }

    public getCurrentMatchLight(): IMatchLight {
      return this.currentMatchLight;
    }

    public getCurrentMatch(): IMatch {
      return this.currentMatch;
    }

    public getCurrentFirstMatch(): IMatchFirst {
      return this.currentFirstMatch;
    }

    public getCurrentSecondMatch(): IMatchSecond {
      return this.currentSecondMatch;
    }

    public getCurrentFirstMatchScorersA(): Array<IForecastScorer> {
      return this.currentFirstMatchScorersA;
    }

    public getCurrentFirstMatchScorersB(): Array<IForecastScorer> {
      return this.currentFirstMatchScorersB;
    }

    public getCurrentSecondMatchScorersA(): Array<IForecastScorer> {
      return this.currentSecondMatchScorersA;
    }

    public getCurrentSecondMatchScorersB(): Array<IForecastScorer> {
      return this.currentSecondMatchScorersB;
    }

    public getCurrentFirstMatchPlayersA(): Array<IPlayer> {
      return this.currentFirstMatchPlayersA;
    }

    public getCurrentFirstMatchPlayersB(): Array<IPlayer> {
      return this.currentFirstMatchPlayersB;
    }

    public getCurrentSecondMatchPlayersA(): Array<IPlayer> {
      return this.currentSecondMatchPlayersA;
    }

    public getCurrentSecondMatchPlayersB(): Array<IPlayer> {
      return this.currentSecondMatchPlayersB;
    }


    // Lecture des championnats et journées à pronostiquer
    public readWeeks(): ng.IPromise<Array<IChampionshipAndWeek>> {
      let d: ng.IDeferred<Array<IChampionshipAndWeek>> = this.$q.defer<Array<IChampionshipAndWeek>>();

      // Lecture des championnats Ligue 1 et Europe
      let url = "./dist/forecast-weeks.php";

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "pronostiqueur": this.generalService.getUser().Pronostiqueur })
      }).then((response: { data: Array<IChampionshipAndWeek> }) => {
        this.championshipsAndWeeks = response.data;
        if (this.championshipsAndWeeks.length) {
          this.currentChampionshipAndWeek = this.championshipsAndWeeks[0];
          this.readMatchesLight(this.currentChampionshipAndWeek).then((matches: Array<IMatchLight>) => {
            d.resolve(response.data);
          });
        }

      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service readWeeks: Server error";
        console.error(errMsg);
        d.reject(errMsg);
      });

      return d.promise;
    }

    // Sélection d'un championnat
    public setCurrentChampionshipAndWeek(championshipAndWeek: IChampionshipAndWeek): void {
      this.currentChampionshipAndWeek = championshipAndWeek;
    }

    // Lecture des matches de la journée (informations minimales)
    public readMatchesLight(championshipAndWeek: IChampionshipAndWeek): ng.IPromise<Array<IMatchLight>> {
      let d: ng.IDeferred<Array<IMatchLight>> = this.$q.defer<Array<IMatchLight>>();

      // Lecture des matches de la journée
      let url = "./dist/forecast-matches-light.php";

      let def: ng.IDeferred<Array<IMatchLight>> = this.$q.defer<Array<IMatchLight>>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "pronostiqueur": this.generalService.getUser().Pronostiqueur, "journee": championshipAndWeek.Journee})
      }).then((response: { data: Array<IMatchLight> }) => {
        this.matchesLight = response.data;
        this.initCurrentMatch();
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service readMatchesLight: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return d.promise;
    }

    // Sélection d'un match
    public selectMatchLight(matchLight: IMatchLight): void {
      this.currentMatchLight = matchLight;

      if(this.currentMatchLight.Matches_TypeMatch == 2) {
        this.readMatchFaceOff(matchLight).then((ret: boolean) => {
          // Logistique du match
          let dateFirstMatch: any = this.moment(this.currentFirstMatch.Matches_Date);
          let dateSecondMatch: any = this.moment(this.currentSecondMatch.Matches_Date);
          this.matchFirstLimitDateLabel = dateFirstMatch.format("dddd D MMMM à HH:mm");
          this.matchSecondLimitDateLabel = dateSecondMatch.format("dddd D MMMM à HH:mm");
          this.checkExtraAndShootingFaceOff();
        });
      }
      /*this.readMatch(matchLight).then((ret: boolean) => {

        for (let i: number = 0; i < MatchName.matchNames.length; i++) {
          if (this.currentMatch.Matches_TypeMatch == MatchName.matchNames[i].type) {
            this.matchLabel = MatchName.matchNames[i].name;
            break;
          }
        }

        // Logistique du match
        let date: any = this.moment(this.currentFirstMatch.Matches_Date);
        let dateMax: any = this.moment(this.currentSecondMatch.Matches_Date);
        if (this.currentFirstMatch.Matches_Date === this.currentFirstMatch.Matches_DateMax) {
          this.limitDateLabel = "Match et limite de pronostic le " + date.format("dddd D MMMM à HH:mm");
        }
        else {
          this.limitDateLabel = "Match le " + date.format("dddd D MMMM à HH:mm") + " et date limite de pronostic le " + dateMax.format("dddd D MMMM à HH:mm");
        }

        this.checkExtraAndShooting();
      });*/
    }

    public checkExtraAndShootingFaceOff(): void {
      // Doit-on afficher les scores AP et les TAB ?
      this.mustDisplayScoresExtraFaceOff();
      this.mustDisplayShootingFaceOff();
    }

    public checkExtraAndShootingNormal(): void {
      // Doit-on afficher les scores AP et les TAB ?
      this.mustDisplayScoresExtraNormal();
      this.mustDisplayShootingNormal();
    }

    // Vérification de la nécessité d'afficher les scores AP ou non
    private mustDisplayScoresExtraFaceOff(): void {
      this.displayScoresExtra = false;

      // Match retour de confrontation directe
      if (
        this.currentFirstMatch.Pronostics_ScoreEquipeDomicile != null &&
        this.currentFirstMatch.Pronostics_ScoreEquipeVisiteur != null &&
        this.currentSecondMatch.Pronostics_ScoreEquipeDomicile != null &&
        this.currentSecondMatch.Pronostics_ScoreEquipeVisiteur != null
      ) {
        // Si le score aller est le même que le score retour, alors on affiche le score AP
        if (
          this.currentFirstMatch.Pronostics_ScoreEquipeDomicile == this.currentSecondMatch.Pronostics_ScoreEquipeDomicile &&
          this.currentFirstMatch.Pronostics_ScoreEquipeVisiteur == this.currentSecondMatch.Pronostics_ScoreEquipeVisiteur
        ) {
          // On remplit le score minimal de chaque équipe avec celui de la fin du temps règlementaire
          this.scoresExtraA = [];
          this.scoresExtraB = [];
          let i: number;
          for(i = Number(this.currentSecondMatch.Pronostics_ScoreEquipeDomicile); i <= 15; i++)
            this.scoresExtraA.push(i);

          for(i = Number(this.currentSecondMatch.Pronostics_ScoreEquipeVisiteur); i <= 15; i++)
            this.scoresExtraB.push(i);

          if(this.currentSecondMatch.Pronostics_ScoreAPEquipeDomicile === null)
            this.currentSecondMatch.Pronostics_ScoreAPEquipeDomicile = this.currentSecondMatch.Pronostics_ScoreEquipeDomicile;

          if(this.currentSecondMatch.Pronostics_ScoreAPEquipeVisiteur === null)
            this.currentSecondMatch.Pronostics_ScoreAPEquipeVisiteur = this.currentSecondMatch.Pronostics_ScoreEquipeVisiteur;

          this.displayScoresExtra = true;
        }
      }
    }

    private mustDisplayShootingFaceOff(): void {
      if(this.displayShooting === false)
        this.currentSecondMatch.Pronostics_Vainqueur = 0;

      this.displayShooting = false;

      if (
        this.currentFirstMatch.Pronostics_ScoreEquipeDomicile != null &&
        this.currentFirstMatch.Pronostics_ScoreEquipeVisiteur != null &&
        this.currentSecondMatch.Pronostics_ScoreEquipeDomicile != null &&
        this.currentSecondMatch.Pronostics_ScoreEquipeVisiteur != null
      ) {
        // Si le score aller est le même que le score retour, alors on affiche la zone des TAB
        if (
          this.currentSecondMatch.Pronostics_ScoreEquipeDomicile == this.currentSecondMatch.Pronostics_ScoreAPEquipeDomicile &&
          this.currentSecondMatch.Pronostics_ScoreEquipeVisiteur == this.currentSecondMatch.Pronostics_ScoreAPEquipeVisiteur
        ) {
          this.displayShooting = true;
        }
      }
    }

    // Vérification de la nécessité d'afficher les scores AP ou non
    private mustDisplayScoresExtraNormal(): void {
      this.displayScoresExtra = false;

      // Seuls les matches de type 3 et 4 sont concernés
      if (this.currentMatch.Matches_TypeMatch == 3 || this.currentMatch.Matches_TypeMatch == 4) {
        // Match retour de confrontation directe
        if(this.currentMatch.Matches_TypeMatch == 3) {
          if (
            this.currentMatch.Pronostics_ScoreEquipeDomicile != null &&
            this.currentMatch.Pronostics_ScoreEquipeVisiteur != null &&
            this.currentMatch.PronosticsLies_ScoreEquipeDomicile != null &&
            this.currentMatch.PronosticsLies_ScoreEquipeVisiteur != null
          ) {
            // Si le score aller est le même que le score retour, alors on affiche le score AP
            if (
              this.currentMatch.Pronostics_ScoreEquipeDomicile == this.currentMatch.PronosticsLies_ScoreEquipeDomicile &&
              this.currentMatch.Pronostics_ScoreEquipeVisiteur == this.currentMatch.PronosticsLies_ScoreEquipeVisiteur
            ) {
              // On remplit le score minimal de chaque équipe avec celui de la fin du temps règlementaire
              this.scoresExtraA = [];
              this.scoresExtraB = [];
              let i: number;
              for(i = Number(this.currentMatch.Pronostics_ScoreEquipeDomicile); i <= 15; i++)
                this.scoresExtraA.push(i);

              for(i = Number(this.currentMatch.Pronostics_ScoreEquipeVisiteur); i <= 15; i++)
                this.scoresExtraB.push(i);

              if(this.currentMatch.Pronostics_ScoreAPEquipeDomicile === null)
                this.currentMatch.Pronostics_ScoreAPEquipeDomicile = this.currentMatch.Pronostics_ScoreEquipeDomicile;

              if(this.currentMatch.Pronostics_ScoreAPEquipeVisiteur === null)
                this.currentMatch.Pronostics_ScoreAPEquipeVisiteur = this.currentMatch.Pronostics_ScoreEquipeVisiteur;

              this.displayScoresExtra = true;
            }
          }
        }
        // Finale de coupe
        else if (this.currentMatch.Matches_TypeMatch == 4) {
          if (this.currentMatch.Pronostics_ScoreEquipeDomicile != null && this.currentMatch.Pronostics_ScoreEquipeVisiteur != null) {
            // Si les scores 90' sont les mêmes, alors on affiche le score AP
            if (this.currentMatch.Pronostics_ScoreEquipeDomicile == this.currentMatch.Pronostics_ScoreEquipeDomicile) {
              // On remplit le score minimal de chaque équipe avec celui de la fin du temps règlementaire
              this.scoresExtraA = [];
              this.scoresExtraB = [];
              let i: number;
              for (i = Number(this.currentMatch.Pronostics_ScoreEquipeDomicile); i <= 15; i++)
                this.scoresExtraA.push(i);

              for (i = Number(this.currentMatch.Pronostics_ScoreEquipeVisiteur); i <= 15; i++)
                this.scoresExtraB.push(i);

              if (this.currentMatch.Pronostics_ScoreAPEquipeDomicile === null)
                this.currentMatch.Pronostics_ScoreAPEquipeDomicile = this.currentMatch.Pronostics_ScoreEquipeDomicile;

              if (this.currentMatch.Pronostics_ScoreAPEquipeVisiteur === null)
                this.currentMatch.Pronostics_ScoreAPEquipeVisiteur = this.currentMatch.Pronostics_ScoreEquipeVisiteur;

              this.displayScoresExtra = true;
            }
          }
        }
      }
    }

    private mustDisplayShootingNormal(): void {
      if(this.displayShooting === false)
        this.currentMatch.Pronostics_Vainqueur = 0;

      this.displayShooting = false;

      // Seuls les matches de type 3, 4 et 5 sont concernés
      if (this.currentMatch.Matches_TypeMatch >= 3 && this.currentMatch.Matches_TypeMatch <= 5) {
        // Match retour de confrontation directe
        if (this.currentMatch.Matches_TypeMatch == 3) {
          if (
            this.currentMatch.Pronostics_ScoreEquipeDomicile != null &&
            this.currentMatch.Pronostics_ScoreEquipeVisiteur != null &&
            this.currentMatch.PronosticsLies_ScoreEquipeDomicile != null &&
            this.currentMatch.PronosticsLies_ScoreEquipeVisiteur != null
          ) {
            // Si le score aller est le même que le score retour, alors on affiche la zone des TAB
            if (
              this.currentMatch.Pronostics_ScoreEquipeDomicile == this.currentMatch.Pronostics_ScoreAPEquipeDomicile &&
              this.currentMatch.Pronostics_ScoreEquipeVisiteur == this.currentMatch.Pronostics_ScoreAPEquipeVisiteur
            ) {
              this.displayShooting = true;
            }
          }
        }
        // Finale de coupe
        else if (this.currentMatch.Matches_TypeMatch == 4) {
          if (
            this.currentMatch.Pronostics_ScoreEquipeDomicile != null &&
            this.currentMatch.Pronostics_ScoreEquipeVisiteur != null &&
            this.currentMatch.Pronostics_ScoreAPEquipeDomicile != null &&
            this.currentMatch.Pronostics_ScoreAPEquipeVisiteur != null
          ) {
            // Si les scores 90' sont les mêmes et idem pour les scores AP, alors on affiche la zone des TAB
            if (
              this.currentMatch.Pronostics_ScoreEquipeDomicile == this.currentMatch.Pronostics_ScoreEquipeVisiteur &&
              this.currentMatch.Pronostics_ScoreAPEquipeDomicile == this.currentMatch.Pronostics_ScoreAPEquipeVisiteur
            ) {
              this.displayShooting = true;
            }
          }
        }
        // Charity Shield
        else if(this.currentMatch.Matches_TypeMatch == 5) {
          if (
            this.currentMatch.Pronostics_ScoreEquipeDomicile != null &&
            this.currentMatch.Pronostics_ScoreEquipeVisiteur != null
          ) {
            // Si les scores 90' sont les mêmes, alors on affiche la zone des TAB
            if (this.currentMatch.Pronostics_ScoreEquipeDomicile == this.currentMatch.Pronostics_ScoreEquipeVisiteur) {
              this.displayShooting = true;
            }
          }
        }
      }

    }

    // Lecture d'un match
    public readMatch(matchLight: IMatchLight): ng.IPromise<boolean> {
      let d: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Lecture des informations d'un match
      let url = "./dist/forecast-match-face-off.php";

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "pronostiqueur" : this.generalService.getUser().Pronostiqueur, "match": matchLight.Match })
      }).then((response: { data: any }) => {
        this.currentFirstMatch = response.data[0].aller[0];
        this.currentSecondMatch = response.data[0].retour[0];
        d.resolve(true);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service readMatch: Server error";
        console.error(errMsg);
        d.reject(errMsg);
      });
      return d.promise;
    }

    // Lecture d'un match de confrontation directe
    public readMatchFaceOff(matchLight: IMatchLight): ng.IPromise<boolean> {
      let d: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Lecture des informations d'un match
      let url = "./dist/forecast-match-face-off.php";

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "pronostiqueur" : this.generalService.getUser().Pronostiqueur, "match": matchLight.Match })
      }).then((response: { data: any }) => {
        this.currentFirstMatch = response.data[0].aller[0];
        this.currentSecondMatch = response.data[0].retour[0];
        this.currentFirstMatchScorersA = response.data[0].aller_buteurs_domicile;
        this.currentFirstMatchScorersB = response.data[0].aller_buteurs_visiteur;
        this.currentSecondMatchScorersA = response.data[0].retour_buteurs_domicile;
        this.currentSecondMatchScorersB = response.data[0].retour_buteurs_visiteur;
        this.currentFirstMatchPlayersA = response.data[0].aller_joueurs_domicile;
        this.currentFirstMatchPlayersB = response.data[0].aller_joueurs_visiteur;
        this.currentSecondMatchPlayersA = response.data[0].retour_joueurs_domicile;
        this.currentSecondMatchPlayersB = response.data[0].retour_joueurs_visiteur;

        d.resolve(true);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service readMatch: Server error";
        console.error(errMsg);
        d.reject(errMsg);
      });
      return d.promise;
    }

    // Réinitialisation du match en cours
    public initCurrentMatch(): void {
      this.currentMatch = null;
    }

    public deleteScorerFaceOff($index: number, forecastScorer: IForecastScorer, matchFirstOrSecond: number, teamAOrB: number): void {
      if(matchFirstOrSecond === 0) {
        // Match aller
        if(teamAOrB === 0) {
          // Equipe domicile
          this.currentFirstMatchScorersA.splice($index, 1);
        }
        else if(teamAOrB === 1) {
          // Equipe visiteur
          this.currentFirstMatchScorersB.splice($index, 1);
        }
      }
      else {
        // Match retour
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentSecondMatchScorersA.splice($index, 1);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentSecondMatchScorersB.splice($index, 1);
        }
      }
    }

    public addScorerFaceOff(player: IPlayer, matchFirstOrSecond: number, teamAOrB: number): void {
      let scorer: IForecastScorer = {
        Joueurs_Joueur: player.Joueur,
        Joueurs_NomComplet: player.Joueurs_NomComplet
      };
      if (matchFirstOrSecond === 0) {
        // Match aller
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentFirstMatchScorersA.push(scorer);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentFirstMatchScorersB.push(scorer);
        }
      }
      else {
        // Match retour
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentSecondMatchScorersA.push(scorer);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentSecondMatchScorersB.push(scorer);
        }
      }

      this.groupBy(this.currentFirstMatchScorersA, () => {
        console.log("Dans l'appel de groupBy", scorer);
        return scorer.Joueurs_Joueur;
      });
    }

    public groupBy(array: Array<IForecastScorer>, f: any): any {
      let groups: any = {};
      array.forEach(function (object) {
        let group: any = JSON.stringify(f(object));
        groups[group] = groups[group] || [];
        groups[group].push(object);
      });

      console.log("Groupe construit", groups);
      return Object.keys(groups).map(function (group) {
        return groups[group];
      })
    }

    // Mise à jour des pronostics
    public updateForecast(forecastActionCode: number): ng.IPromise<boolean> {
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Mise à jour des données
      let url = "./dist/forecast-update.php";

      this.$http({
        method: "POST",
        url: url,
        params: { forecastActionCode: forecastActionCode },
        data: angular.toJson(this.currentFirstMatch)
      }).then((response: { data: boolean }) => {
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service updateForecast: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });
      return def.promise;
    }
  }
}
