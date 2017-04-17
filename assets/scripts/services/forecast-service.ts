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

    public readWeeks(): ng.IPromise<Array<IChampionshipAndWeek>> {
      // Lecture des championnats et journées à pronostiquer
      // Tous les championnats sont concernés
      let d: ng.IDeferred<Array<IChampionshipAndWeek>> = this.$q.defer<Array<IChampionshipAndWeek>>();

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

    public setCurrentChampionshipAndWeek(championshipAndWeek: IChampionshipAndWeek): void {
      // Sélection d'un championnat
      this.currentChampionshipAndWeek = championshipAndWeek;
    }

    public readMatchesLight(championshipAndWeek: IChampionshipAndWeek): ng.IPromise<Array<IMatchLight>> {
      // Lecture des matches de la journée (informations minimales)
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

    public selectMatchLight(matchLight: IMatchLight): void {
      // Sélection d'un match
      this.currentMatchLight = matchLight;

      if (this.currentMatchLight.Matches_TypeMatch == 2) {
        this.readMatchFaceOff(matchLight).then((ret: boolean) => {
          // Logistique du match
          let dateFirstMatch: any = this.moment(this.currentFirstMatch.Matches_Date);
          let dateSecondMatch: any = this.moment(this.currentSecondMatch.Matches_Date);
          this.matchFirstLimitDateLabel = dateFirstMatch.format("dddd D MMMM à HH:mm");
          this.matchSecondLimitDateLabel = dateSecondMatch.format("dddd D MMMM à HH:mm");
          this.checkExtraAndShootingFaceOff();
        });
      }
    }

    public checkExtraAndShootingFaceOff(forecastActionCode?: number): void {
      // Doit-on afficher les scores AP et les TAB ?
      this.mustDisplayScoresExtraFaceOff();
      this.mustDisplayShootingFaceOff();

      if (forecastActionCode !== null && forecastActionCode !== undefined)
        this.updateForecastFaceOff(forecastActionCode);
    }

    private mustDisplayScoresExtraFaceOff(): void {
      // Vérification de la nécessité d'afficher les scores AP ou non
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

          if (this.currentSecondMatch.Pronostics_ScoreAPEquipeDomicile === null)
            this.currentSecondMatch.Pronostics_ScoreAPEquipeDomicile = this.currentSecondMatch.Pronostics_ScoreEquipeDomicile;

          if (this.currentSecondMatch.Pronostics_ScoreAPEquipeVisiteur === null)
            this.currentSecondMatch.Pronostics_ScoreAPEquipeVisiteur = this.currentSecondMatch.Pronostics_ScoreEquipeVisiteur;

          this.displayScoresExtra = true;
        }
        else {
          // Sinon, on remet les scores AP à null
          this.currentSecondMatch.Pronostics_ScoreAPEquipeDomicile = null;
          this.currentSecondMatch.Pronostics_ScoreAPEquipeVisiteur = null;
          this.currentSecondMatch.Pronostics_Vainqueur = "0";
        }
      }
    }

    private mustDisplayShootingFaceOff(): void {
      // Vérification de la nécessité d'afficher les TAB ou non
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

      if (this.displayShooting === false)
        this.currentSecondMatch.Pronostics_Vainqueur = "0";
    }

    public readMatchFaceOff(matchLight: IMatchLight): ng.IPromise<boolean> {
      // Lecture d'un match de confrontation directe
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
      if (matchFirstOrSecond === 0) {
        if (new Date(this.currentFirstMatch.Matches_Date).getTime() < new Date().getTime())
          return;
      }
      else if (matchFirstOrSecond === 1) {
        if (new Date(this.currentSecondMatch.Matches_Date).getTime() < new Date().getTime())
          return;
      }

      if (matchFirstOrSecond === 0) {
        // Match aller
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentFirstMatchScorersA.splice($index, 1);
          this.removeScorer(enumForecastActionCode.AllerSuppressionButeurDomicile, forecastScorer, this.currentFirstMatch.Match, this.currentFirstMatch.Matches_Date);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentFirstMatchScorersB.splice($index, 1);
          this.removeScorer(enumForecastActionCode.AllerSuppressionButeurVisiteur, forecastScorer, this.currentFirstMatch.Match, this.currentFirstMatch.Matches_Date);
        }
      }
      else {
        // Match retour
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentSecondMatchScorersA.splice($index, 1);
          this.removeScorer(enumForecastActionCode.RetourSuppressionButeurDomicile, forecastScorer, this.currentSecondMatch.Match, this.currentSecondMatch.Matches_Date);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentSecondMatchScorersB.splice($index, 1);
          this.removeScorer(enumForecastActionCode.RetourSuppressionButeurVisiteur, forecastScorer, this.currentSecondMatch.Match, this.currentSecondMatch.Matches_Date);
        }
      }
    }

    public addScorerFaceOff(player: IPlayer, matchFirstOrSecond: number, teamAOrB: number): void {
      if (matchFirstOrSecond === 0) {
        if (new Date(this.currentFirstMatch.Matches_Date).getTime() < new Date().getTime())
          return;
      }
      else if (matchFirstOrSecond === 1) {
        if (new Date(this.currentSecondMatch.Matches_Date).getTime() < new Date().getTime())
          return;
      }

      let scorer: IForecastScorer = {
        Joueurs_Joueur: player.Joueur,
        Joueurs_NomComplet: player.Joueurs_NomComplet
      };
      if (matchFirstOrSecond === 0) {
        // Match aller
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentFirstMatchScorersA.push(scorer);
          this.addScorer(enumForecastActionCode.AllerAjoutButeurDomicile, player, this.currentFirstMatch.Match, this.currentFirstMatch.Matches_Date);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentFirstMatchScorersB.push(scorer);
          this.addScorer(enumForecastActionCode.AllerAjoutButeurVisiteur, player, this.currentFirstMatch.Match, this.currentFirstMatch.Matches_Date);
        }
      }
      else if (matchFirstOrSecond === 1) {
        // Match retour
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentSecondMatchScorersA.push(scorer);
          this.addScorer(enumForecastActionCode.RetourAjoutButeurDomicile, player, this.currentSecondMatch.Match, this.currentSecondMatch.Matches_Date);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentSecondMatchScorersB.push(scorer);
          this.addScorer(enumForecastActionCode.RetourAjoutButeurVisiteur, player, this.currentSecondMatch.Match, this.currentSecondMatch.Matches_Date);
        }
      }
    }

    public changeScoreFaceOff(forecastActionCode: number): void {
      // Pronostic sur le score uniquement avant la fin du match aller
      if (new Date(this.currentFirstMatch.Matches_Date).getTime() > new Date().getTime())
        this.checkExtraAndShootingFaceOff(forecastActionCode);
    }

    private updateForecastFaceOff(forecastActionCode: number): ng.IPromise<boolean> {
      // Mise à jour du score d'un pronostic de confrontation directe
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Mise à jour des données
      let url = "./dist/forecast-update-face-off.php";

      this.$http({
        method: "POST",
        url: url,
        params: { forecastActionCode: forecastActionCode },
        data: angular.toJson({"pronostiqueur": this.generalService.getUser().Pronostiqueur, "aller": this.currentFirstMatch, "retour": this.currentSecondMatch})
      }).then((response: { data: boolean }) => {
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service updateForecastFaceOff: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });
      return def.promise;
    }

    private addScorer(forecastActionCode: number, player: IPlayer, matchNumber: number, matchDate: Date): ng.IPromise<boolean> {
      // Ajout d'un pronostic de buteur
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Mise à jour des données
      let url = "./dist/forecast-update-face-off.php";

      this.$http({
        method: "POST",
        url: url,
        params: { forecastActionCode: forecastActionCode },
        data: angular.toJson({ "pronostiqueur": this.generalService.getUser().Pronostiqueur, "joueur": player.Joueur, "match": matchNumber, "date": matchDate })
      }).then((response: { data: boolean }) => {
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service addScorer: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });
      return def.promise;
    }

    private removeScorer(forecastActionCode: number, forecastScorer: IForecastScorer, matchNumber: number, matchDate: Date): ng.IPromise<boolean> {
      // Suppression d'un pronostic de buteur
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Mise à jour des données
      let url = "./dist/forecast-update-face-off.php";
      this.$http({
        method: "POST",
        url: url,
        params: { forecastActionCode: forecastActionCode },
        data: angular.toJson({ "pronostiqueur": this.generalService.getUser().Pronostiqueur, "joueur": forecastScorer.Joueurs_Joueur, "match": matchNumber, "date": matchDate  })
      }).then((response: { data: boolean }) => {
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service addScorer: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });
      return def.promise;
    }

    public isOver(date: Date): boolean {
      let ret: boolean = false;
      if(date !== null && date !== undefined) {
        if(new Date(date).getTime() < new Date().getTime())
          ret = true;
      }

      return ret;
    }

  }
}
