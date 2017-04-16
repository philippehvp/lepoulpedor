/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class TeamsChampionshipController {
    private championship: number;
    private europe: number;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Mise à jour du thème selon le championnat (et le fait que l'on affiche ou non les équipes européennes de la ligue 1)
      if(this.championship === 1) {
        if(this.europe === 0)
          this.contestCentreService.setCurrentThemeAndSubTheme('', 'contest.equipes.l1-sans-europe');
        else
          this.contestCentreService.setCurrentThemeAndSubTheme('', 'contest.equipes.l1-europe');
      }
      else if(this.championship === 2)
        this.contestCentreService.setCurrentThemeAndSubTheme('', 'contest.equipes.ldc');
      else if(this.championship === 3)
        this.contestCentreService.setCurrentThemeAndSubTheme('', 'contest.equipes.el');

      // Lecture des équipes du championnat
      this.contestCentreService.readTeams(this.championship, this.europe).then((data) => {
      });
    }

    // Sélection d'une équipe
    selectTeam(teamLight: ITeamLight): void {
      this.contestCentreService.setCurrentTeamLight(teamLight);
    }
  }
}