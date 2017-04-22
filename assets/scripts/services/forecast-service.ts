/// <reference path="../angular.d.ts" />

module LPO {
  "use strict";

  export class ForecastService {
    private championshipsAndWeeks: Array<IChampionshipAndWeek>;
    private currentChampionshipAndWeek: IChampionshipAndWeek;
    private matchesLight: Array<IMatchLight>;
    private currentMatchLight: IMatchLight;

    // Match qui n'est pas de type confrontation directe
    private currentSingleMatch: ISingleMatch;
    // Matches de confrontation directe
    private currentFirstMatch: IMatchFirst;
    private currentSecondMatch: IMatchSecond;

    // Pronostic de buteur
    private currentSingleMatchScorersA: Array<IForecastScorer>;
    private currentSingleMatchScorersB: Array<IForecastScorer>;
    private currentFirstMatchScorersA: Array<IForecastScorer>;
    private currentFirstMatchScorersB: Array<IForecastScorer>;
    private currentSecondMatchScorersA: Array<IForecastScorer>;
    private currentSecondMatchScorersB: Array<IForecastScorer>;

    // Joueurs
    private currentSingleMatchPlayersA: Array<IPlayer>;
    private currentSingleMatchPlayersB: Array<IPlayer>;
    private currentFirstMatchPlayersA: Array<IPlayer>;
    private currentFirstMatchPlayersB: Array<IPlayer>;
    private currentSecondMatchPlayersA: Array<IPlayer>;
    private currentSecondMatchPlayersB: Array<IPlayer>;

    private currentSingleMatchLimitDateLabel: string;
    private currentFirstMatchLimitDateLabel: string;
    private currentSecondMatchLimitDateLabel: string;

    // Score possible des matches (de 0 à 15)
    private scores: Array<number>;

    // Pour les scores AP, cela dépend du score 90
    private scoresExtraA: Array<number>;
    private scoresExtraB: Array<number>;

    private displayScoresExtra: boolean;
    private displayShooting: boolean;

    // Affichage ou masquage de la liste des joueurs
    private currentSingleMatchCollapsedPlayers: boolean;
    private currentFirstMatchCollapsedPlayers: boolean;
    private currentSecondMatchCollapsedPlayers: boolean;

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

    public getCurrentSingleMatch(): ISingleMatch {
      return this.currentSingleMatch;
    }

    public getCurrentFirstMatch(): IMatchFirst {
      return this.currentFirstMatch;
    }

    public getCurrentSecondMatch(): IMatchSecond {
      return this.currentSecondMatch;
    }

    public getCurrentSingleMatchScorersA(): Array<IForecastScorer> {
      return this.currentSingleMatchScorersA;
    }

    public getCurrentSingleMatchScorersB(): Array<IForecastScorer> {
      return this.currentSingleMatchScorersB;
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

    public getCurrentSingleMatchPlayersA(): Array<IPlayer> {
      return this.currentSingleMatchPlayersA;
    }

    public getCurrentSingleMatchPlayersB(): Array<IPlayer> {
      return this.currentSingleMatchPlayersB;
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

    public setCurrentChampionshipAndWeek(championshipAndWeek: IChampionshipAndWeek): void {
      // Sélection d'un championnat
      this.currentChampionshipAndWeek = championshipAndWeek;
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
        this.initCurrentMatches();
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
          this.currentFirstMatchLimitDateLabel = dateFirstMatch.format("dddd D MMMM YYYY à HH:mm");
          this.currentSecondMatchLimitDateLabel = dateSecondMatch.format("dddd D MMMM YYYY à HH:mm");
          this.checkExtraAndShootingFaceOff();
        });
      }
      else {
        this.readMatchSingle(matchLight).then((ret: boolean) => {
          // Logistique du match
          let dateSingleMatch: any = this.moment(this.currentSingleMatch.Matches_Date);
          this.currentSingleMatchLimitDateLabel = dateSingleMatch.format("dddd D MMMM YYYY à HH:mm");
          this.checkExtraAndShootingSingle();
        });
      }
    }

    public checkExtraAndShootingSingle(forecastActionCode?: number): void {
      // Doit-on afficher les scores AP et les TAB ?
      this.mustDisplayScoresExtraSingle();
      this.mustDisplayShootingSingle();

      if(forecastActionCode !== null && forecastActionCode !== undefined)
        this.updateForecastSingle(forecastActionCode);
    }

    public checkExtraAndShootingFaceOff(forecastActionCode?: number): void {
      // Doit-on afficher les scores AP et les TAB ?
      this.mustDisplayScoresExtraFaceOff();
      this.mustDisplayShootingFaceOff();

      if (forecastActionCode !== null && forecastActionCode !== undefined)
        this.updateForecastFaceOff(forecastActionCode);
    }

    private mustDisplayScoresExtraSingle(): void {
      // Vérification de la nécessité d'afficher les scores AP ou non
      this.displayScoresExtra = false;

      // Match retour de confrontation directe
      if (
        this.currentSingleMatch.Pronostics_ScoreEquipeDomicile != null &&
        this.currentSingleMatch.Pronostics_ScoreEquipeVisiteur != null
      ) {
        // Si les scores 90 sont les mêmes, alors on affiche le score AP sauf dans le cas du match de Community Shield
        if (
          this.currentSingleMatch.Pronostics_ScoreEquipeDomicile == this.currentSingleMatch.Pronostics_ScoreEquipeVisiteur && this.currentSingleMatch.Matches_TypeMatch == 5
        ) {
          // On remplit le score minimal de chaque équipe avec celui de la fin du temps règlementaire
          this.scoresExtraA = [];
          this.scoresExtraB = [];
          let i: number;
          for (i = Number(this.currentSingleMatch.Pronostics_ScoreEquipeDomicile); i <= 15; i++) {
            this.scoresExtraA.push(i);
            this.scoresExtraB.push(i);
          }

          if (this.currentSingleMatch.Pronostics_ScoreAPEquipeDomicile === null)
            this.currentSingleMatch.Pronostics_ScoreAPEquipeDomicile = this.currentSingleMatch.Pronostics_ScoreEquipeDomicile;

          if (this.currentSingleMatch.Pronostics_ScoreAPEquipeVisiteur === null)
            this.currentSingleMatch.Pronostics_ScoreAPEquipeVisiteur = this.currentSingleMatch.Pronostics_ScoreEquipeVisiteur;

          this.displayScoresExtra = true;
        }
        else {
          // Sinon, on remet les scores AP à null
          this.currentSingleMatch.Pronostics_ScoreAPEquipeDomicile = null;
          this.currentSingleMatch.Pronostics_ScoreAPEquipeVisiteur = null;
          this.currentSingleMatch.Pronostics_Vainqueur = "0";
        }
      }
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

    private mustDisplayShootingSingle(): void {
      // Vérification de la nécessité d'afficher les TAB ou non
      this.displayShooting = false;

      if (
        this.currentSingleMatch.Pronostics_ScoreEquipeDomicile != null &&
        this.currentSingleMatch.Pronostics_ScoreEquipeVisiteur != null
      ) {
        // Pour les matches autres que le Community Shield, si les scores AP sont identiques alors on affiche les TAB
        // Pour le match de Community Shield, ce sont seulement les scores 90 puisqu'il n'y a pas de prolongation
        if (
          (
            this.currentSingleMatch.Matches_TypeMatch != 5 &&
            this.currentSingleMatch.Pronostics_ScoreAPEquipeDomicile == this.currentSingleMatch.Pronostics_ScoreAPEquipeVisiteur &&
            this.currentSingleMatch.Pronostics_ScoreAPEquipeDomicile != null && this.currentSingleMatch.Pronostics_ScoreAPEquipeVisiteur != null
          ) ||
          (
            this.currentSingleMatch.Matches_TypeMatch == 5 &&
            this.currentSingleMatch.Pronostics_ScoreEquipeDomicile == this.currentSingleMatch.Pronostics_ScoreEquipeVisiteur
          )
        ) {
          this.displayShooting = true;
        }
      }

      if (this.displayShooting === false)
        this.currentSingleMatch.Pronostics_Vainqueur = "0";
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

    public readMatchSingle(matchLight: IMatchLight): ng.IPromise<boolean> {
      // Lecture d'un match de confrontation directe
      let d: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Lecture des informations d'un match
      let url = "./dist/forecast-match-single.php";

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "pronostiqueur": this.generalService.getUser().Pronostiqueur, "match": matchLight.Match })
      }).then((response: { data: any }) => {
        this.currentSingleMatch = response.data[0].match[0];
        this.currentSingleMatchScorersA = response.data[0].buteurs_domicile;
        this.currentSingleMatchScorersB = response.data[0].buteurs_visiteur;
        this.currentSingleMatchPlayersA = response.data[0].joueurs_domicile;
        this.currentSingleMatchPlayersB = response.data[0].joueurs_visiteur;
        this.currentSingleMatchCollapsedPlayers = new Date(this.currentSingleMatch.Matches_Date.toString()).getTime() < new Date().getTime();
        d.resolve(true);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service readMatchSingle: Server error";
        console.error(errMsg);
        d.reject(errMsg);
      });
      return d.promise;
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
        this.currentFirstMatchCollapsedPlayers = new Date(this.currentFirstMatch.Matches_Date.toString()).getTime() < new Date().getTime();
        this.currentSecondMatchCollapsedPlayers = this.currentFirstMatchCollapsedPlayers === false ? true : new Date(this.currentSecondMatch.Matches_Date.toString()).getTime() < new Date().getTime();
        d.resolve(true);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service readMatchFaceOff: Server error";
        console.error(errMsg);
        d.reject(errMsg);
      });
      return d.promise;
    }

    // Réinitialisation du match en cours (lorsque l'on change de journée ou de match / rencontre)
    public initCurrentMatches(): void {
      this.currentSingleMatch = null;
      this.currentFirstMatch = null;
      this.currentSecondMatch = null;
    }

    public deleteScorerSingle($index: number, forecastScorer: IForecastScorer, teamAOrB: number): void {
      if (this.currentSingleMatch.Buteurs_Pronostiquables == 0)
          return;

      if (teamAOrB === 0) {
        // Equipe domicile
        this.currentSingleMatchScorersA.splice($index, 1);
        this.removeScorer(enumForecastSingleActionCode.SingleMatchDeleteScorerA, forecastScorer, this.currentSingleMatch.Match, this.currentSingleMatch.Matches_Date);
      }
      else if (teamAOrB === 1) {
        // Equipe visiteur
        this.currentSingleMatchScorersB.splice($index, 1);
        this.removeScorer(enumForecastSingleActionCode.SingleMatchDeleteScorerB, forecastScorer, this.currentSingleMatch.Match, this.currentSingleMatch.Matches_Date);
      }
    }

    public deleteScorerFaceOff($index: number, forecastScorer: IForecastScorer, matchFirstOrSecond: number, teamAOrB: number): void {
      if (matchFirstOrSecond === 0) {
        if (this.currentFirstMatch.Buteurs_Pronostiquables == 0)
          return;
      }
      else if (matchFirstOrSecond === 1) {
        if (this.currentSecondMatch.Buteurs_Pronostiquables == 0)
          return;
      }

      if (matchFirstOrSecond === 0) {
        // Match aller
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentFirstMatchScorersA.splice($index, 1);
          this.removeScorer(enumForecastFaceOffActionCode.FirstMatchDeleteScorerA, forecastScorer, this.currentFirstMatch.Match, this.currentFirstMatch.Matches_Date);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentFirstMatchScorersB.splice($index, 1);
          this.removeScorer(enumForecastFaceOffActionCode.FirstMatchDeleteScorerB, forecastScorer, this.currentFirstMatch.Match, this.currentFirstMatch.Matches_Date);
        }
      }
      else {
        // Match retour
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentSecondMatchScorersA.splice($index, 1);
          this.removeScorer(enumForecastFaceOffActionCode.SecondMatchDeleteScorerA, forecastScorer, this.currentSecondMatch.Match, this.currentSecondMatch.Matches_Date);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentSecondMatchScorersB.splice($index, 1);
          this.removeScorer(enumForecastFaceOffActionCode.SecondMatchDeleteScorerB, forecastScorer, this.currentSecondMatch.Match, this.currentSecondMatch.Matches_Date);
        }
      }
    }

    public addScorerSingle(player: IPlayer, teamAOrB: number): void {
      if (this.currentSingleMatch.Buteurs_Pronostiquables == 0)
          return;

      let scorer: IForecastScorer = {
        Joueurs_Joueur: player.Joueur,
        Joueurs_NomComplet: player.Joueurs_NomComplet
      };

      if (teamAOrB === 0) {
        // Equipe domicile
        this.currentFirstMatchScorersA.push(scorer);
        this.addScorer(enumForecastSingleActionCode.SingleMatchAddScorerA, player, this.currentSingleMatch.Match, this.currentSingleMatch.Matches_Date);
      }
      else if (teamAOrB === 1) {
        // Equipe visiteur
        this.currentFirstMatchScorersB.push(scorer);
        this.addScorer(enumForecastSingleActionCode.SingleMatchAddScorerB, player, this.currentSingleMatch.Match, this.currentSingleMatch.Matches_Date);
      }
    }

    public addScorerFaceOff(player: IPlayer, matchFirstOrSecond: number, teamAOrB: number): void {
      if (matchFirstOrSecond === 0) {
        if (this.currentFirstMatch.Buteurs_Pronostiquables == 0)
          return;
      }
      else if (matchFirstOrSecond === 1) {
        if (this.currentSecondMatch.Buteurs_Pronostiquables == 0)
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
          this.addScorer(enumForecastFaceOffActionCode.FirstMatchAddScorerA, player, this.currentFirstMatch.Match, this.currentFirstMatch.Matches_Date);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentFirstMatchScorersB.push(scorer);
          this.addScorer(enumForecastFaceOffActionCode.FirstMatchAddScorerB, player, this.currentFirstMatch.Match, this.currentFirstMatch.Matches_Date);
        }
      }
      else if (matchFirstOrSecond === 1) {
        // Match retour
        if (teamAOrB === 0) {
          // Equipe domicile
          this.currentSecondMatchScorersA.push(scorer);
          this.addScorer(enumForecastFaceOffActionCode.SecondMatchAddScorerA, player, this.currentSecondMatch.Match, this.currentSecondMatch.Matches_Date);
        }
        else if (teamAOrB === 1) {
          // Equipe visiteur
          this.currentSecondMatchScorersB.push(scorer);
          this.addScorer(enumForecastFaceOffActionCode.SecondMatchAddScorerB, player, this.currentSecondMatch.Match, this.currentSecondMatch.Matches_Date);
        }
      }
    }

    public changeScoreSingle(forecastActionCode: number): void {
      if (this.currentSingleMatch.Matches_Pronostiquable != 0)
        this.checkExtraAndShootingSingle(forecastActionCode);
    }

    public changeScoreFaceOff(forecastActionCode: number): void {
      // Pronostic sur le score uniquement avant la fin du match aller
      if (this.currentFirstMatch.Matches_Pronostiquable != 0)
        this.checkExtraAndShootingFaceOff(forecastActionCode);
    }

    private updateForecastSingle(forecastActionCode: number): ng.IPromise<boolean> {
      // Mise à jour du score d'un pronostic de match hors confrontation directe
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Mise à jour des données
      let url = "./dist/forecast-update-single.php";

      let updateParams: any = {
        "pronostiqueur": this.generalService.getUser().Pronostiqueur,
        "match": {
          "Match": this.currentSingleMatch.Match,
          "Matches_Date": this.currentSingleMatch.Matches_Date,
          "Pronostics_ScoreEquipeDomicile": this.currentSingleMatch.Pronostics_ScoreEquipeDomicile,
          "Pronostics_ScoreEquipeVisiteur": this.currentSingleMatch.Pronostics_ScoreEquipeVisiteur,
          "Pronostics_ScoreAPEquipeDomicile": this.currentSingleMatch.Pronostics_ScoreEquipeDomicile,
          "Pronostics_ScoreAPEquipeVisiteur": this.currentSingleMatch.Pronostics_ScoreEquipeVisiteur,
          "Pronostics_Vainqueur": this.currentSingleMatch.Pronostics_Vainqueur
        }
      }

      this.$http({
        method: "POST",
        url: url,
        params: { forecastActionCode: forecastActionCode },
        data: angular.toJson(updateParams)
      }).then((response: { data: boolean }) => {
        def.resolve(response.data);
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "forecast-service updateForecastSingle: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });
      return def.promise;
    }

    private updateForecastFaceOff(forecastActionCode: number): ng.IPromise<boolean> {
      // Mise à jour du score d'un pronostic de confrontation directe
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      // Mise à jour des données
      let url = "./dist/forecast-update-face-off.php";

      let updateParams: any = {
        "pronostiqueur": this.generalService.getUser().Pronostiqueur,
        "aller": {
          "Match": this.currentFirstMatch.Match,
          "Matches_Date": this.currentFirstMatch.Matches_Date,
          "Pronostics_ScoreEquipeDomicile": this.currentFirstMatch.Pronostics_ScoreEquipeDomicile,
          "Pronostics_ScoreEquipeVisiteur": this.currentFirstMatch.Pronostics_ScoreEquipeVisiteur
        },
        "retour": {
          "Match": this.currentSecondMatch.Match,
          "Matches_Date": this.currentSecondMatch.Matches_Date,
          "Pronostics_ScoreEquipeDomicile": this.currentSecondMatch.Pronostics_ScoreEquipeDomicile,
          "Pronostics_ScoreEquipeVisiteur": this.currentSecondMatch.Pronostics_ScoreEquipeVisiteur,
          "Pronostics_ScoreAPEquipeDomicile": this.currentSecondMatch.Pronostics_ScoreAPEquipeDomicile,
          "Pronostics_ScoreAPEquipeVisiteur": this.currentSecondMatch.Pronostics_ScoreAPEquipeVisiteur,
          "Pronostics_Vainqueur": this.currentSecondMatch.Pronostics_Vainqueur
        }
      }

      this.$http({
        method: "POST",
        url: url,
        params: { forecastActionCode: forecastActionCode },
        data: angular.toJson(updateParams)
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

    public getCurrentSingleMatchCollapsedPlayers(): boolean {
      return this.currentSingleMatchCollapsedPlayers;
    }

    public toggleCurrentSingleMatchCollapsedPlayers(): void {
      this.currentSingleMatchCollapsedPlayers = !this.currentSingleMatchCollapsedPlayers;
    }

    public getCurrentFirstMatchCollapsedPlayers(): boolean {
      return this.currentFirstMatchCollapsedPlayers;
    }

    public toggleCurrentFirstMatchCollapsedPlayers(): void {
      this.currentFirstMatchCollapsedPlayers = !this.currentFirstMatchCollapsedPlayers;
    }

    public getCurrentSecondMatchCollapsedPlayers(): boolean {
      return this.currentSecondMatchCollapsedPlayers;
    }

    public toggleCurrentSecondMatchCollapsedPlayers(): void {
      this.currentSecondMatchCollapsedPlayers = !this.currentSecondMatchCollapsedPlayers;
    }

  }
}
