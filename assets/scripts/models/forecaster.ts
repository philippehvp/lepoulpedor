module LPO {
    "use strict";


    export interface IForecaster {
        Pronostiqueur: number;
        Pronostiqueurs_NomUtilisateur: string;
        Pronostiqueurs_Nom: string;
        Pronostiqueurs_Prenom: string;
        Pronostiqueurs_Photo: string;
        Pronostiqueurs_Administrateur: number;
        Pronostiqueurs_MEL: string;
        Pronostiqueurs_MotDePasse: string;
        Pronostiqueurs_PremiereConnexion: number;
        Pronostiqueurs_DateDeNaissance: Date;
        Pronostiqueurs_DateDebutPresence: Date;
        Pronostiqueurs_DateFinPresence: Date;
        Pronostiqueurs_LieuDeResidence: string;
        Pronostiqueurs_Ambitions: string;
        Pronostiqueurs_Palmares: string;
        Pronostiqueurs_Carriere: string;
        Pronostiqueurs_Commentaire: string;
        Pronostiqueurs_EquipeFavorite: string;
        Pronostiqueurs_CodeCouleur: string;
        Themes_Theme: number;
    }

    export interface IForecasterLight {
        Pronostiqueur: number;
        Pronostiqueurs_NomUtilisateur: string;
        Pronostiqueurs_Nom: string;
        Pronostiqueurs_Prenom: string;
        Pronostiqueurs_Photo: string;
    }
}
