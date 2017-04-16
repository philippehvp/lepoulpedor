module LPO {
  "use strict";

  export interface IUser {
    Pronostiqueur: number;
    Pronostiqueurs_NomUtilisateur: string;
    Pronostiqueurs_Prenom: string;
    Pronostiqueurs_Administrateur: number;
    Pronostiqueurs_Photo: string;
    Pronostiqueurs_PremiereConnexion: number;
    Pronostiqueurs_AfficherTropheesChampionnat: number;
    Pronostiqueurs_MotDePasse: string;
  }
}