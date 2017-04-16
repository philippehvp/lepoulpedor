<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $team = $postedData["equipe"];

  $sql =		"	SELECT		joueurs.Joueur, CONCAT(joueurs.Joueurs_NomFamille, ' ', IFNULL(joueurs.Joueurs_Prenom, '')) AS Joueurs_NomComplet, joueurs.Postes_Poste" .
            "	FROM		  joueurs" .
            "	JOIN		  joueurs_equipes" .
					  "				    ON		joueurs.Joueur = joueurs_equipes.Joueurs_Joueur" .
					  "	WHERE		  JoueursEquipes_Debut <= NOW()" .
					  "				    AND		(JoueursEquipes_Fin IS NULL OR JoueursEquipes_Fin > NOW())" .
					  "				    AND		joueurs_equipes.Equipes_Equipe = " . $team .
					  "	ORDER BY	Joueurs_NomComplet";
	$query = $db->query($sql);
	$players = $query->fetchAll();

  echo json_encode($players);

?>