/// <reference path="../../../angular.d.ts" />


module LPO {
  "use strict";

  export class StandingsChampionshipController {
    private championship: number;
    private type: number;
    private leftOrRightForecaster: EnumLeftRight;

    constructor(private navbarService: NavbarService, private contestCentreService: ContestCentreService) {
    }

    $onInit() {
      this.navbarService.closeMobileMenu();

      // Lecture des points du championnat
      this.contestCentreService.readStandingsForecastersLight(this.championship).then((data) => {
        this.leftOrRightForecaster = EnumLeftRight.LEFT;
        this.selectForecaster(this.contestCentreService.getCurrentForecasterLight());
        this.leftOrRightForecaster = EnumLeftRight.RIGHT;
      });
    }

    // Sélection d'un pronostiqueur par l'utilisateur
    public selectForecaster(forecasterLight: IForecasterLight): void {
      this.contestCentreService.setCurrentForecasterLight(forecasterLight);
      if(this.leftOrRightForecaster === EnumLeftRight.LEFT)
        this.contestCentreService.setCurrentLeftForecasterLight(forecasterLight);
      else if(this.leftOrRightForecaster === EnumLeftRight.RIGHT)
        this.contestCentreService.setCurrentRightForecasterLight(forecasterLight);
      if (this.leftOrRightForecaster !== EnumLeftRight.UNKNOWN)
        if(this.type === 1)
          this.contestCentreService.readGeneralStandings(this.championship, this.leftOrRightForecaster, forecasterLight).then((data) => {});
        else
          this.contestCentreService.readWeekStandings(this.championship, this.leftOrRightForecaster, forecasterLight).then((data) => {});
    }

    // Mise à jour du pronostiqueur (à gauche)
    public setLeftForecaster(): void {
      this.leftOrRightForecaster = EnumLeftRight.LEFT;
    }

    // Mise à jour du pronostiqueur (à droite)
    public setRightForecaster(): void {
      this.leftOrRightForecaster = EnumLeftRight.RIGHT;
    }

    // Sélection du pronostiqueur de gauche ?
    public getLeftForecaster(): boolean {
      return this.leftOrRightForecaster === EnumLeftRight.LEFT;
    }

    // Sélection du pronostiqueur de droite ?
    public getRightForecaster(): boolean {
      return this.leftOrRightForecaster === EnumLeftRight.RIGHT;
    }
  }
}