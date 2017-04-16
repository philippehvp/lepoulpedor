/// <reference path="../angular.d.ts" />


module LPO {
  "use strict";

  export class StandingsService {
    private seasons: Array<ISeason>;
    private championships: Array<IChampionship>;
    private weeks: Array<IWeek>;
    private standings: Array<IStanding>;
    private standingsWeek: Array<IStandingWeek>;
    private standingsGoal: Array<IStandingGoal>;

    private currentSeason: ISeason;
    private currentChampionship: Championship;
    private currentWeek: IWeek;
    private currentReferenceDate: Date;

    private currentWeeksOfChampionships: Array<IWeek>;
    private currentUpdateTimeWeek: Date;

    private standingsType: Array<IStandingType> = [{ "label": "Général", "value": 0 }, { "label": "Journée", "value": 1 }, { "label": "Général Buteur", "value": 2 }];
    private currentStandings: IStandingType;

    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
      this.currentStandings = this.standingsType[0];
      this.init();
    }

    private init() {
      this.seasons = [{ Saison: 2017 }];
      this.currentWeeksOfChampionships = [];

      // Lecture de tous les championnats
      let isFirstWeekSelected: boolean = true;
      let promise: ng.IPromise<boolean> = this.selectSeason(isFirstWeekSelected, this.seasons[0]);
      promise.then((data) => {
      }, (err) => {
        console.error("StandingsService $onInit(): Error during reading seasons");
      });
    }

    // Sélection d'une saison
    selectSeason(isFirstWeekSelected: boolean, season: ISeason): ng.IPromise<boolean> {
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      if (this.currentSeason === season)
        def.resolve(true);

      this.currentSeason = season;

      this.championships = [];
      this.weeks = [];
      this.standings = [];

      // Lecture de tous les championnats (sauf la Coupe de France)
      this.getChampionships(this.currentSeason).then((championships) => {
        this.championships = championships;

        // Sélection automatique du premier championnat
        if (this.championships != null && this.championships.length) {
          this.selectChampionship(isFirstWeekSelected, this.championships[0]);
        }
        def.resolve(true);
      }, (error) => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "standings-service selectSeason: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Sélection d'un championnat
    selectChampionship(isFirstWeekSelected: boolean, championship: Championship): ng.IPromise<boolean> {
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      this.currentChampionship = championship;

      /* Sélection de toutes les journées d'un championnat */
      this.getWeeks(this.currentSeason, this.currentChampionship).then((weeks) => {
        this.weeks = weeks;
        this.standings = [];

        // Placement automatique sur la première journée du championnat sélectionné
        // Sauf si, pour ce championnat, on s'est déjà placé sur une autre journée
        if (this.weeks != null && this.weeks.length) {
          if (this.currentWeeksOfChampionships[this.currentChampionship.Championnat.toString()] != null)
            this.selectWeek(isFirstWeekSelected, this.currentWeeksOfChampionships[this.currentChampionship.Championnat.toString()], this.currentWeeksOfChampionships[this.currentChampionship.Championnat.toString()].Classements_DateReference);
          else
            this.selectWeek(isFirstWeekSelected, this.weeks[0], this.weeks[0].Classements_DateReference);
        }

        def.resolve(true);

      }, (error) => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "StandingsService selectChampionship: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    // Sélection d'une journée et d'une date de référence
    selectWeek(isFirstWeekSelected: boolean, week: IWeek, referenceDate: Date): ng.IPromise<boolean> {
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      this.currentWeek = week;
      this.currentReferenceDate = referenceDate;
      this.currentUpdateTimeWeek = week.Journees_DateMAJ;
      this.currentWeeksOfChampionships[this.currentChampionship.Championnat.toString()] = this.currentWeek;

      let p1: ng.IPromise<boolean> = this.getStandings();
      let p2: ng.IPromise<boolean> = this.getStandingsWeek();
      let p3: ng.IPromise<boolean> = this.getStandingsGoal();

      this.$q.all([p1, p2, p3]).then((data) => {
        // Le fait d'être sur la première journée implique qu'on n'affichera jamais la progression par-rapport à la journée précédente
        let weekLastIndex = this.weeks.length - 1;
        isFirstWeekSelected = (this.currentWeek.Journee == this.weeks[weekLastIndex].Journee && this.currentWeek.Classements_DateReference == this.weeks[weekLastIndex].Classements_DateReference);
        def.resolve(true);
      }, (error) => {
        def.reject();
      });

      return def.promise;
    }

    public getStandings(): ng.IPromise<boolean> {
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      this.readStandings(this.currentSeason, this.currentChampionship, this.currentWeek, this.currentReferenceDate).then((standings) => {
        this.standings = standings;
        def.resolve(true);
      }, (err) => {
        console.error("StandingsService getStandings: Error during reading standings");
        def.reject();
      });

      return def.promise;
    }

    public getStandingsWeek(): ng.IPromise<boolean> {
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      this.readStandingsWeek(this.currentSeason, this.currentWeek, this.currentReferenceDate).then((standingsWeek) => {
        this.standingsWeek = standingsWeek;
        def.resolve(true);
      }, (err) => {
        console.error("StandingsService getStandingsWeek(): Error during reading standings week");
        def.reject();
      });

      return def.promise;
    }

    public getStandingsGoal(): ng.IPromise<boolean> {
      let def: ng.IDeferred<boolean> = this.$q.defer<boolean>();

      this.readStandingsGoal(this.currentSeason, this.currentChampionship, this.currentWeek, this.currentReferenceDate).then((standingsGoal) => {
        this.standingsGoal = standingsGoal;
        def.resolve(true);
      }, (err) => {
        console.error("StandingsService getStandingsGoal(): Error during reading standings goal");
        def.reject();
      });

      return def.promise;
    }

    // Sélection d'un type classement à afficher
    selectStandings(standings: IStandingType): void {
      this.currentStandings = standings;
    }

    /* Sélection de la saison */
    getSeasons(): Array<ISeason> {
      return [{ Saison: 2017 }];
    }

    /* Sélection de tous les championnats */
    getChampionships(season: ISeason): ng.IPromise<Array<IChampionship>> {
      let url = "./dist/championships.php";

      let def: ng.IDeferred<Array<IChampionship>> = this.$q.defer<Array<IChampionship>>();

      this.$http({
        method: "POST",
        url: url,
        data: { saison: season }
      }).then((response: {data: Array<IChampionship>}) => {
        def.resolve(response.data);
      }, (error) => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "StandingsService getChampionships: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    /* Sélection de toutes les journées */
    getWeeks(season: ISeason, championship: Championship): ng.IPromise<Array<IWeek>> {
      let url = "./dist/weeks.php";

      let def: ng.IDeferred<Array<IWeek>> = this.$q.defer<Array<IWeek>>();

      this.$http({
        method: "POST",
        url: url,
        data: { saison: season.Saison, championnat: championship.Championnat }
      }).then((response: {data: Array<IWeek>}) => {
        def.resolve(response.data);
      }, (error) => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "StandingsService getWeeks: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    /* Sélection de tous les classements généraux d'une journée */
    readStandings(season: ISeason, championship: Championship, week: IWeek, referenceDate: Date): ng.IPromise<Array<IStanding>> {
      let url = "./dist/standings.php";

      let def: ng.IDeferred<Array<IStanding>> = this.$q.defer<Array<IStanding>>();

      this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "saison": season.Saison, "championnat": championship.Championnat, "journee": week.Journee, "date-reference": referenceDate.toString() })
      }).then((response: {data: Array<IStanding>}) => {
        def.resolve(response.data);
      }, (error) => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "StandingsService getStandings: Server error";
        console.error(errMsg);
        def.reject(errMsg);
      });

      return def.promise;
    }

    /* Sélection de tous les classements de la journée d'une journée */
    readStandingsWeek(season: ISeason, week: IWeek, referenceDate: Date): ng.IPromise<Array<IStandingWeek>> {
      let url = "./dist/standings-week.php";

      return this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "saison": season.Saison, "journee": week.Journee, "date-reference": referenceDate.toString() })
      }).then((response: {data: Array<IStandingWeek>}) => {
        return response.data;
      }, function errorCallback(error) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "StandingsService getStandingsWeek: Server error";
        console.error(errMsg);
        return [];
      });
    }

    /* Sélection de tous les classements généraux buteur d'une journée */
    readStandingsGoal(season: ISeason, championship: Championship, week: IWeek, referenceDate: Date): ng.IPromise<Array<IStandingGoal>> {
      let url = "./dist/standings-goal.php";

      return this.$http({
        method: "POST",
        url: url,
        data: JSON.stringify({ "saison": season.Saison, "championnat": championship.Championnat, "journee": week.Journee, "date-reference": referenceDate.toString() })
      }).then((response: {data: Array<IStandingGoal>}) => {
        return response.data;
      }, (error) => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "StandingsService getStandingsGoal: Server error";
        console.error(errMsg);
        return [];
      });
    }
  }
}
