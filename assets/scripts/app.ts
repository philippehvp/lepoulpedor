/// <reference path="angular.d.ts" />
/// <reference path="angular-route.d.ts" />

/// <reference path="models/forecaster-awards.ts" />

/// <reference path="services/general-service.ts" />
/// <reference path="services/navbar-service.ts" />
/// <reference path="services/standings-service.ts" />
/// <reference path="services/forecast-service.ts" />
/// <reference path="services/contest-centre-service.ts" />

/// <reference path="controllers/navbar-controller.ts" />
/// <reference path="controllers/home-controller.ts" />
/// <reference path="controllers/login-controller.ts" />
/// <reference path="controllers/standings-controller.ts" />
/// <reference path="controllers/forecast/forecast-controller.ts" />
/// <reference path="controllers/forecast/forecast-match-normal-controller.ts" />
/// <reference path="controllers/forecast/forecast-match-face-off-controller.ts" />


/// <reference path="controllers/contest-centre-controller.ts" />
/// <reference path="controllers/contest/forecasters/forecasters-controller.ts" />
/// <reference path="controllers/contest/forecasters/forecaster-id-controller.ts" />
/// <reference path="controllers/contest/forecasters/forecaster-awards-controller.ts" />
/// <reference path="controllers/contest/forecasters/forecaster-stats-controller.ts" />
/// <reference path="controllers/contest/forecasters/forecaster-standings-controller.ts" />
/// <reference path="controllers/contest/forecasters/forecaster-standings-svg-controller.ts" />
/// <reference path="controllers/contest/scorers/scorers-controller.ts" />
/// <reference path="controllers/contest/scorers/scorers-championship-controller.ts" />
/// <reference path="controllers/contest/awards/awards-controller.ts" />
/// <reference path="controllers/contest/awards/awards-championship-controller.ts" />
/// <reference path="controllers/contest/points/points-controller.ts" />
/// <reference path="controllers/contest/points/points-championship-controller.ts" />
/// <reference path="controllers/contest/l1/l1-controller.ts" />
/// <reference path="controllers/contest/l1/l1-win-draw-loss-controller.ts" />
/// <reference path="controllers/contest/l1/l1-ratio-controller.ts" />
/// <reference path="controllers/contest/l1/l1-team-points-controller.ts" />
/// <reference path="controllers/contest/l1/l1-best-teams-controller.ts" />
/// <reference path="controllers/contest/l1/l1-canal-controller.ts" />
/// <reference path="controllers/contest/standings/general-standings-controller.ts" />
/// <reference path="controllers/contest/standings/week-standings-controller.ts" />
/// <reference path="controllers/contest/standings/standings-championship-controller.ts" />
/// <reference path="controllers/contest/teams/teams-controller.ts" />
/// <reference path="controllers/contest/teams/teams-championship-controller.ts" />
/// <reference path="controllers/contest/teams/team-players-controller.ts" />

module LPO {
  "use strict";

  let appModule = angular.module("lepoulpedorApp", ["ngAnimate", "ui.router", "ui.bootstrap", "ui.layout", "angularMoment", "ngCookies"]);

  appModule
    .service("generalService", ["$http", "$q", "navbarService", "$state", "$cookies", ($http, $q, navbarService, $state, $cookies) => new GeneralService($http, $q, navbarService, $state, $cookies)])
    .service("navbarService", [() => new NavbarService()])
    .service("standingsService", ["$http", "$q", ($http, $q) => new StandingsService($http, $q)])
    .service("forecastService", ["navbarService", "generalService", "$http", "$q", "$state", "moment", (navbarService, generalService, $http, $q, $state, moment) => new ForecastService(navbarService, generalService, $http, $q, $state, moment)])
    .service("contestCentreService", ["navbarService", "$http", "$q", "$state", "$window", "$timeout", (navbarService, $http, $q, $state, $window, $timeout) => new ContestCentreService(navbarService, $http, $q, $state, $window, $timeout)]);

  appModule
    .controller("NavbarController", ["navbarService", "generalService", (navbarService, generalService) => new NavbarController(navbarService, generalService)])
    .controller("HomeController", ["navbarService", "generalService", (navbarService, generalService) => new HomeController(navbarService, generalService)])
    .controller("LoginController", ["navbarService", "generalService", "$cookies", "moment", (navbarService, generalService, $cookies, moment) => new LoginController(navbarService, generalService, $cookies, moment)])
    .controller("StandingsController", ["navbarService", "generalService", "standingsService", (navbarService, generalService, standingsService) => new StandingsController(navbarService, generalService, standingsService)])
    .controller("ForecastController", ["navbarService", "generalService", "forecastService", (navbarService, generalService, forecastService) => new ForecastController(navbarService, generalService, forecastService)])
    .controller("ForecastMatchNormalController", ["generalService", "forecastService", (generalService, forecastService) => new ForecastMatchNormalController(generalService, forecastService)])
    .controller("ForecastMatchFaceOffController", ["generalService", "forecastService", (generalService, forecastService) => new ForecastMatchFaceOffController(generalService, forecastService)])

    .controller("ContestCentreController", ["navbarService", "generalService", "contestCentreService", (navbarService, generalService, contestCentreService) => new ContestCentreController(navbarService, generalService, contestCentreService)])
    .controller("ForecastersController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new ForecastersController(navbarService, contestCentreService)])
    .controller("ForecasterIdController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new ForecasterIdController(navbarService, contestCentreService)])
    .controller("ForecasterAwardsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new ForecasterAwardsController(navbarService, contestCentreService)])
    .controller("ForecasterStatsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new ForecasterStatsController(navbarService, contestCentreService)])
    .controller("ForecasterStandingsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new ForecasterStandingsController(navbarService, contestCentreService)])
    .controller("ForecasterStandingsSVGController", ["contestCentreService", (contestCentreService) => new ForecasterStandingsSVGController(contestCentreService)])
    .controller("ScorersController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new ScorersController(navbarService, contestCentreService)])
    .controller("ScorersChampionshipController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new ScorersChampionshipController(navbarService, contestCentreService)])
    .controller("AwardsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new AwardsController(navbarService, contestCentreService)])
    .controller("AwardsChampionshipController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new AwardsChampionshipController(navbarService, contestCentreService)])
    .controller("PointsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new PointsController(navbarService, contestCentreService)])
    .controller("PointsChampionshipController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new PointsChampionshipController(navbarService, contestCentreService)])
    .controller("L1Controller", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new L1Controller(navbarService, contestCentreService)])
    .controller("L1WinDrawLossController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new L1WinDrawLossController(navbarService, contestCentreService)])
    .controller("L1RatioController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new L1RatioController(navbarService, contestCentreService)])
    .controller("L1TeamPointsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new L1TeamPointsController(navbarService, contestCentreService)])
    .controller("L1BestTeamsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new L1BestTeamsController(navbarService, contestCentreService)])
    .controller("L1CanalController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new L1CanalController(navbarService, contestCentreService)])
    .controller("GeneralStandingsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new GeneralStandingsController(navbarService, contestCentreService)])
    .controller("WeekStandingsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new WeekStandingsController(navbarService, contestCentreService)])
    .controller("StandingsChampionshipController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new StandingsChampionshipController(navbarService, contestCentreService)])
    .controller("TeamsController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new TeamsController(navbarService, contestCentreService)])
    .controller("TeamsChampionshipController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new TeamsChampionshipController(navbarService, contestCentreService)])
    .controller("TeamPlayersController", ["navbarService", "contestCentreService", (navbarService, contestCentreService) => new TeamPlayersController(navbarService, contestCentreService)]);

  appModule
    .component("navbarDesktop", { controller: "NavbarController as ctrl", templateUrl: "./dist/navbar-desktop.php" })
    .component("navbarMobile", { controller: "NavbarController as ctrl", templateUrl: "./dist/navbar-mobile.php" })
    .component("home", { controller: "HomeController as ctrl", templateUrl: "./dist/home.html" })
    .component("login", { controller: "LoginController as ctrl", templateUrl: "./dist/login.html" })
    .component("standings", { controller: "StandingsController as ctrl", templateUrl: "./dist/standings.html" })
    .component("forecast", { controller: "ForecastController as ctrl", templateUrl: "./dist/forecast.html" })
    .component("forecastMatchNormal", { controller: "ForecastMatchNormalController as ctrl", templateUrl: "./dist/forecast-match-normal.html" })
    .component("forecastMatchFaceOff", { controller: "ForecastMatchFaceOffController as ctrl", templateUrl: "./dist/forecast-match-face-off.html" })
    .component("contest", { controller: "ContestCentreController as ctrl", templateUrl: "./dist/contest-centre.html" })
    .component("forecasters", { controller: "ForecastersController as ctrl", templateUrl: "./dist/forecasters.html" })
    .component("forecasterId", { controller: "ForecasterIdController as ctrl", templateUrl: "./dist/forecaster-id.html" })
    .component("forecasterAwards", { controller: "ForecasterAwardsController as ctrl", templateUrl: "./dist/forecaster-awards.html" })
    .component("forecasterStats", { controller: "ForecasterStatsController as ctrl", templateUrl: "./dist/forecaster-stats.html" })
    .component("forecasterStandings", { controller: "ForecasterStandingsController as ctrl", templateUrl: "./dist/forecaster-standings.html" })
    .component("forecasterStandingsSvg", { controller: "ForecasterStandingsSVGController as ctrl", templateUrl: "./dist/forecaster-standings-svg.html", bindings: { standings: '<', maxCount: '<'} })
    .component("scorers", { controller: "ScorersController as ctrl", templateUrl: "./dist/scorers.html" })
    .component("scorersChampionship", { controller: "ScorersChampionshipController as ctrl", templateUrl: "./dist/scorers-championship.html", bindings: { championship: '<'} })
    .component("awards", { controller: "AwardsController as ctrl", templateUrl: "./dist/awards.html" })
    .component("awardsChampionship", { controller: "AwardsChampionshipController as ctrl", templateUrl: "./dist/awards-championship.html", bindings: { championship: '<'} })
    .component("points", { controller: "PointsController as ctrl", templateUrl: "./dist/points.html" })
    .component("pointsChampionship", { controller: "PointsChampionshipController as ctrl", templateUrl: "./dist/points-championship.html", bindings: { championship: '<'} })
    .component("l1", { controller: "L1Controller as ctrl", templateUrl: "./dist/l1.html" })
    .component("l1WinDrawLoss", { controller: "L1WinDrawLossController as ctrl", templateUrl: "./dist/l1-win-draw-loss.html" })
    .component("l1Ratio", { controller: "L1RatioController as ctrl", templateUrl: "./dist/l1-ratio.html" })
    .component("l1TeamPoints", { controller: "L1TeamPointsController as ctrl", templateUrl: "./dist/l1-team-points.html" })
    .component("l1BestTeams", { controller: "L1BestTeamsController as ctrl", templateUrl: "./dist/l1-best-teams.html" })
    .component("l1Canal", { controller: "L1CanalController as ctrl", templateUrl: "./dist/l1-canal.html" })
    .component("generalStandings", { controller: "GeneralStandingsController as ctrl", templateUrl: "./dist/general-week-standings.html" })
    .component("weekStandings", { controller: "WeekStandingsController as ctrl", templateUrl: "./dist/general-week-standings.html" })
    .component("standingsChampionship", { controller: "StandingsChampionshipController as ctrl", templateUrl: "./dist/standings-championship.html", bindings: { championship: '<', type: '<' } })
    .component("teams", { controller: "TeamsController as ctrl", templateUrl: "./dist/teams.html" })
    .component("teamsChampionship", { controller: "TeamsChampionshipController as ctrl", templateUrl: "./dist/teams-championship.html", bindings: { championship: '<', europe: '<' } })
    .component("teamPlayers", { controller: "TeamPlayersController as ctrl", templateUrl: "./dist/team-players.html" });


  appModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/accueil");

    $stateProvider
      .state("accueil", {
        url: "/accueil", template: "<home></home>"
      })
      .state("connexion", {
        url: "/connexion", template: "<login></login>"
      })
      .state("classements", {
        url: "/classements", template: "<standings></standings>"
      })
      .state("pronostics", {
        url: "/pronostics", template: "<forecast></forecast>"
      })
      .state("contest", {
        url: "/contest", template: "<contest></contest>"
      })
      .state("contest.pronostiqueurs", {
        url: "/pronostiqueurs", template: "<forecasters></forecasters>",
      })
      .state("contest.pronostiqueurs.fiche", {
        url: "/pronostiqueur-fiche", template: "<forecaster-id></forecaster-id>"
      })
      .state("contest.pronostiqueurs.palmares", {
        url: "/pronostiqueur-palmares", template: "<forecaster-awards></forecaster-awards>"
      })
      .state("contest.pronostiqueurs.stats", {
        url: "/pronostiqueur-stats", template: "<forecaster-stats></forecaster-stats>"
      })
      .state("contest.pronostiqueurs.classements", {
        url: "/pronostiqueur-classements", template: "<forecaster-standings></forecaster-standings>"
      })
      .state("contest.buteurs", {
        url: "/buteurs", template: "<scorers></scorers>"
      })
      .state("contest.buteurs.l1", {
        url: "/buteurs-l1", template: "<scorers-championship championship='1'></scorers-championship>"
      })
      .state("contest.buteurs.ldc", {
        url: "/buteurs-ldc", template: "<scorers-championship championship='2'></scorers-championship>"
      })
      .state("contest.buteurs.el", {
        url: "/buteurs-el", template: "<scorers-championship championship='3'></scorers-championship>"
      })
      .state("contest.palmares", {
        url: "/palmares", template: "<awards></awards>"
      })
      .state("contest.palmares.l1", {
        url: "/palmares-l1", template: "<awards-championship championship='1'></awards-championship>"
      })
      .state("contest.palmares.ldc", {
        url: "/palmares-ldc", template: "<awards-championship championship='2'></awards-championship>"
      })
      .state("contest.palmares.el", {
        url: "/palmares-el", template: "<awards-championship championship='3'></awards-championship>"
      })
      .state("contest.points", {
        url: "/points", template: "<points></points>"
      })
      .state("contest.points.l1", {
        url: "/points-l1", template: "<points-championship championship='1'></points-championship>"
      })
      .state("contest.points.ldc", {
        url: "/points-ldc", template: "<points-championship championship='2'></points-championship>"
      })
      .state("contest.points.el", {
        url: "/points-el", template: "<points-championship championship='3'></points-championship>"
      })
      .state("contest.l1", {
        url: "/l1", template: "<l1></l1>",
      })
      .state("contest.l1.victoire-nul-defaite", {
        url: "/l1-victoire-nul-defaite", template: "<l1-win-draw-loss></l1-win-draw-loss>"
      })
      .state("contest.l1.ratio", {
        url: "/l1-ratio", template: "<l1-ratio></l1-ratio>"
      })
      .state("contest.l1.points-equipe", {
        url: "/l1-points-equipe", template: "<l1-team-points></l1-team-points>"
      })
      .state("contest.l1.meilleures-equipes", {
        url: "/l1-meilleures-equipes", template: "<l1-best-teams></l1-best-teams>"
      })
      .state("contest.l1.canal", {
        url: "/l1-canal", template: "<l1-canal></l1-canal>"
      })
      .state("contest.classements-general", {
        url: "/classements-general", template: "<general-standings></general-standings>"
      })
      .state("contest.classements-general.l1", {
        url: "/classements-general-l1", template: "<standings-championship championship='1' type='1'></standings-championship>"
      })
      .state("contest.classements-general.ldc", {
        url: "/classements-general-ldc", template: "<standings-championship championship='2' type='1'></standings-championship>"
      })
      .state("contest.classements-general.el", {
        url: "/classements-general-el", template: "<standings-championship championship='3' type='1'></standings-championship>"
      })
      .state("contest.classements-journee", {
        url: "/classements-journee", template: "<week-standings></week-standings>"
      })
      .state("contest.classements-journee.l1", {
        url: "/classements-journee-l1", template: "<standings-championship championship='1' type='2'></standings-championship>"
      })
      .state("contest.classements-journee.ldc", {
        url: "/classements-journee-ldc", template: "<standings-championship championship='2' type='2'></standings-championship>"
      })
      .state("contest.classements-journee.el", {
        url: "/classements-journee-el", template: "<standings-championship championship='3' type='2'></standings-championship>"
      })
      .state("contest.equipes", {
        url: "/equipes", template: "<teams></teams>",
      })
      .state("contest.equipes.l1-sans-europe", {
        url: "/equipes-l1-sans-europe", template: "<teams-championship championship='1' europe='0'></teams-championship>"
      })
      .state("contest.equipes.l1-europe", {
        url: "/equipes-l1-europe", template: "<teams-championship championship='1' europe='1'></teams-championship>"
      })
      .state("contest.equipes.ldc", {
        url: "/equipes-ldc", template: "<teams-championship championship='2' europe='0'></teams-championship>"
      })
      .state("contest.equipes.el", {
        url: "/equipes-el", template: "<teams-championship championship='3' europe='0'></teams-championship>"
      })

      ;
  }]);

}
