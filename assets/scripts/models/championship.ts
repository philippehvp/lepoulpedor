module LPO {
  "use strict";

  export interface IChampionship {
    Championnat: number;
    Championnats_Nom: string;
    Championnats_NomCourt: string;
  }

  export class Championship {
    Championnat: number;
    Championnats_Nom: string;
    Championnats_NomCourt: string;

    constructor(Championnat: number, Championnats_Nom: string, Championnats_NomCourt: string) {
      this.Championnat = Championnat;
      this.Championnats_Nom = Championnats_Nom;
      this.Championnats_NomCourt = Championnats_NomCourt;
    }
  }
}