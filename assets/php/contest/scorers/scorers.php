<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];

  $forecaster = isset($_SESSION["pronostiqueur"]) ? $_SESSION["pronostiqueur"] : 0;

	// Nombre de buteurs pronostiqués et trouvés
	$sql =		'	SELECT		  pronostiqueurs.Pronostiqueur, Pronostiqueurs_NomUtilisateur' .
            '				      ,IFNULL(Nombre_Pronostics_Buteur, 0) AS Nombre_Pronostics_Buteur, IFNULL(Nombre_Buteurs_Trouves, 0) AS Nombre_Buteurs_Trouves, Nombre_Buteurs_Trouves / Nombre_Pronostics_Buteur * 100 AS Ratio_Buteur' .
            '				      ,CASE' .
            '					      WHEN		pronostiqueurs_rivaux.PronostiqueursRivaux_Pronostiqueur IS NOT NULL' .
            '					      THEN		1' .
            '					      ELSE		0' .
            '				      END AS Pronostiqueurs_Rival' .
            '	FROM		    pronostiqueurs' .
            '	JOIN		    inscriptions' .
            '				      ON		pronostiqueurs.Pronostiqueur = inscriptions.Pronostiqueurs_Pronostiqueur' .
            '	LEFT JOIN	  (' .
            ' 					    SELECT		pronostics_buteurs.Pronostiqueurs_Pronostiqueur, COUNT(*) AS Nombre_Pronostics_Buteur' .
            '	  				    FROM		  pronostics_buteurs' .
            '		  			    JOIN		  matches' .
            '			          					ON		pronostics_buteurs.Matches_Match = matches.Match' .
            '					      JOIN		  journees' .
            '								          ON		matches.Journees_Journee = journees.Journee' .
            '					      JOIN		  matches_participants' .
            '								          ON		matches.Match = matches_participants.Matches_Match' .
            '										            AND		pronostics_buteurs.Joueurs_Joueur = matches_participants.Joueurs_Joueur' .
            '					      WHERE		  journees.Championnats_Championnat = ' . $championship .
            '					      GROUP BY	pronostics_buteurs.Pronostiqueurs_Pronostiqueur' .
            '				      ) pronostics_buteur' .
            '				      ON		pronostiqueurs.Pronostiqueur = pronostics_buteur.Pronostiqueurs_Pronostiqueur' .
            '	LEFT JOIN	  (' .
            '					      SELECT		pronostics_buteurs.Pronostiqueurs_Pronostiqueur, COUNT(*) AS Nombre_Buteurs_Trouves' .
            '					      FROM		  (' .
            '									          SELECT		pronostics_buteurs.Pronostiqueurs_Pronostiqueur' .
            '												              ,pronostics_buteurs.Matches_Match' .
            '												              ,pronostics_buteurs.Joueurs_Joueur' .
            '												              ,pronostics_buteurs.Equipes_Equipe' .
            '												              ,CASE' .
            '													              WHEN	@match = pronostics_buteurs.Matches_Match' .
            '															                AND		@joueur = pronostics_buteurs.Joueurs_Joueur' .
            '															                AND		@equipe = pronostics_buteurs.Equipes_Equipe' .
            '													              THEN	@indicePronostics := @indicePronostics + 1' .
            '													              ELSE	(@indicePronostics := 1) AND (@match := pronostics_buteurs.Matches_Match) AND (@joueur := pronostics_buteurs.Joueurs_Joueur) AND (@equipe := pronostics_buteurs.Equipes_Equipe)' .
            '												              END AS Pronostics_Indice' .
            '									FROM		pronostics_buteurs' .
            '									JOIN		matches' .
            '												  ON		pronostics_buteurs.Matches_Match = matches.Match' .
            '									JOIN		journees' .
            '												  ON		matches.Journees_Journee = journees.Journee' .
            '									JOIN		(	SELECT		@indicePronostics := 0, @match := NULL, @joueur := NULL, @equipe := NULL	) r' .
            '									JOIN		matches_participants' .
            '												  ON		matches.Match = matches_participants.Matches_Match' .
            '														    AND		pronostics_buteurs.Joueurs_Joueur = matches_participants.Joueurs_Joueur' .
            '									WHERE		journees.Championnats_Championnat = ' . $championship .
            '									ORDER BY	pronostics_buteurs.Pronostiqueurs_Pronostiqueur, pronostics_buteurs.Matches_Match, pronostics_buteurs.Joueurs_Joueur, pronostics_buteurs.Equipes_Equipe' .
            '								) pronostics_buteurs' .
            '					      JOIN		  (' .
            '									          SELECT		Matches_Match' .
            '												              ,Joueurs_Joueur' .
            '												              ,Equipes_Equipe' .
            '												              ,CASE' .
            '													              WHEN	@match = Matches_Match' .
            '															                AND		@joueur = Joueurs_Joueur' .
            '															                AND		@equipe = Equipes_Equipe' .
            '													              THEN	@indiceMatches := @indiceMatches + 1' .
            '													              ELSE	(@indiceMatches := 1) AND (@match := Matches_Match) AND (@joueur := Joueurs_Joueur) AND (@equipe := Equipes_Equipe)' .
            '												              END AS Matches_Indice' .
            '									          FROM		  matches_buteurs' .
            '									          JOIN		  matches' .
            '												              ON		matches_buteurs.Matches_Match = matches.Match' .
            '									          JOIN		  journees' .
            '												              ON		matches.Journees_Journee = journees.Journee' .
            '									          JOIN		  (	SELECT		@indiceMatches := 0, @joueur := NULL, @equipe := NULL	) r' .
            '									          WHERE		  journees.Championnats_Championnat = ' . $championship .
            '												              AND		matches_buteurs.Buteurs_CSC = 0' .
            '									          ORDER BY	Matches_Match, Joueurs_Joueur, Equipes_Equipe' .
            '								) matches_buteurs' .
            '								ON		pronostics_buteurs.Matches_Match = matches_buteurs.Matches_Match' .
            '										  AND		pronostics_buteurs.Joueurs_Joueur = matches_buteurs.Joueurs_Joueur' .
            '										  AND		pronostics_buteurs.Equipes_Equipe = matches_buteurs.Equipes_Equipe' .
            '										  AND		pronostics_buteurs.Pronostics_Indice = matches_buteurs.Matches_Indice' .
            '					      JOIN		matches' .
            '								        ON		pronostics_buteurs.Matches_Match = matches.Match' .
            '					      JOIN		journees' .
            '								        ON		matches.Journees_Journee = journees.Journee' .
            '					    WHERE		  journees.Championnats_Championnat = ' . $championship .
            '					    GROUP BY	pronostics_buteurs.Pronostiqueurs_Pronostiqueur' .
            '				      ) buteurs_trouves' .
            '				      ON		pronostics_buteur.Pronostiqueurs_Pronostiqueur = buteurs_trouves.Pronostiqueurs_Pronostiqueur' .
            '	LEFT JOIN	pronostiqueurs_rivaux' .
            '				      ON		pronostiqueurs_rivaux.Pronostiqueur = ' . $forecaster .
            '						        AND		pronostiqueurs.Pronostiqueur = pronostiqueurs_rivaux.PronostiqueursRivaux_Pronostiqueur' .
            '	WHERE		    inscriptions.Championnats_Championnat = ' . $championship .
            '	ORDER BY	  Ratio_Buteur DESC';
	$query = $db->query($sql);
	$scorers = $query->fetchAll();

  echo json_encode($scorers);

?>