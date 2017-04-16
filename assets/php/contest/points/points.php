<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];

  $forecaster = isset($_SESSION["pronostiqueur"]) ? $_SESSION["pronostiqueur"] : 0;

	// Points
	$sql =		'	SELECT		pronostiqueurs.Pronostiqueur, Pronostiqueurs_NomUtilisateur' .
            '				    ,CASE' .
            '					    WHEN		pronostiqueurs_rivaux.PronostiqueursRivaux_Pronostiqueur IS NOT NULL' .
            '					    THEN		1' .
            '					    ELSE		0' .
            '				    END AS Pronostiqueurs_Rival' .
            '	FROM		  pronostiqueurs' .
            '	JOIN		  inscriptions' .
            '				    ON		pronostiqueurs.Pronostiqueur = inscriptions.Pronostiqueurs_Pronostiqueur' .
            '	LEFT JOIN	pronostiqueurs_rivaux' .
            '				    ON		pronostiqueurs_rivaux.Pronostiqueur = ' . $forecaster .
            '						      AND		pronostiqueurs.Pronostiqueur = pronostiqueurs_rivaux.PronostiqueursRivaux_Pronostiqueur' .
            '	WHERE		  inscriptions.Championnats_Championnat = ' . $championship .
            '	ORDER BY	Pronostiqueurs_NomUtilisateur';
	$query = $db->query($sql);
	$forecasters = $query->fetchAll();
	
	$sql =		'	SELECT		pronostiqueurs_points_marques.Points_Marques, IFNULL(Nombre, 0) AS Nombre' .
            '	FROM		  (' .
            '					    SELECT		Pronostiqueur, Points_Marques' .
            '					    FROM		  pronostiqueurs' .
            '					    FULL JOIN	(' .
            '									        SELECT 10 AS Points_Marques UNION' .
            '									        SELECT 8 AS Points_Marques UNION' .
            '									        SELECT 7 AS Points_Marques UNION' .
            '									        SELECT 6 AS Points_Marques UNION' .
            '									        SELECT 5 AS Points_Marques UNION' .
            '									        SELECT 3 AS Points_Marques UNION' .
            '									        SELECT 2 AS Points_Marques UNION' .
            '									        SELECT 1 AS Points_Marques UNION' .
            '									        SELECT 0 AS Points_Marques UNION' .
            '									        SELECT -1 AS Points_Marques' .			// Utilisé pour le nombre de pronostics oubliés
            '								        ) points_marques' .
            '					    JOIN		  inscriptions' .
            '								        ON		Pronostiqueur = Pronostiqueurs_Pronostiqueur' .
            '					    WHERE		Championnats_Championnat = ' . $championship .
            '				    ) pronostiqueurs_points_marques' .
            '	LEFT JOIN	(' .
            '					    SELECT		  pronostics.Pronostiqueurs_Pronostiqueur' .
            '								          ,fn_calculpointsmatch	(	IFNULL(matches.Matches_ScoreAPEquipeDomicile, matches.Matches_ScoreEquipeDomicile),' .
            '												                    			IFNULL(matches.Matches_ScoreAPEquipeVisiteur, matches.Matches_ScoreEquipeVisiteur),' .
            '														  	                  IFNULL(pronostics.Pronostics_ScoreAPEquipeDomicile, pronostics.Pronostics_ScoreEquipeDomicile),' .
            '														  	                  IFNULL(pronostics.Pronostics_ScoreAPEquipeVisiteur, pronostics.Pronostics_ScoreEquipeVisiteur)' .
            '														                    ) AS Points_Marques' .
            '								          ,COUNT(*) AS Nombre' .
            '							FROM		  pronostics' .
            '							JOIN		  pronostiqueurs' .
            '										    ON		pronostics.Pronostiqueurs_Pronostiqueur = pronostiqueurs.Pronostiqueur' .
            '							JOIN		  matches' .
            '										    ON		pronostics.Matches_Match = matches.Match' .
            '							JOIN		  journees' .
            '										    ON		matches.Journees_Journee = journees.Journee' .
            '							WHERE		  journees.Championnats_Championnat = ' . $championship .
            '										    AND		pronostics.Pronostics_ScoreEquipeDomicile IS NOT NULL' .
            '										    AND		pronostics.Pronostics_ScoreEquipeVisiteur IS NOT NULL' .
            '										    AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
            '										    AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
            '							GROUP BY	pronostics.Pronostiqueurs_Pronostiqueur' .
            '										    ,fn_calculpointsmatch	(	IFNULL(matches.Matches_ScoreAPEquipeDomicile, matches.Matches_ScoreEquipeDomicile),' .
            '																	              IFNULL(matches.Matches_ScoreAPEquipeVisiteur, matches.Matches_ScoreEquipeVisiteur),' .
            '																	              IFNULL(pronostics.Pronostics_ScoreAPEquipeDomicile, pronostics.Pronostics_ScoreEquipeDomicile),' .
            '																	              IFNULL(pronostics.Pronostics_ScoreAPEquipeVisiteur, pronostics.Pronostics_ScoreEquipeVisiteur)' .
            '																              )' .
            '					    UNION ALL' .
            '					    SELECT		Pronostiqueurs_Pronostiqueur, -1 AS Points_Marques, COUNT(*) AS Nombre' .
            '					    FROM		  matches' .
            '					    JOIN		  journees' .
            '								        ON		matches.Journees_Journee = journees.Journee' .
            '					    LEFT JOIN	pronostics' .
            '								        ON		matches.Match = pronostics.Matches_Match' .
            '					    WHERE		  journees.Championnats_Championnat = ' . $championship .
            '								        AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
            '								        AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
            '								        AND		pronostics.Pronostics_ScoreEquipeDomicile IS NULL' .
            '								        AND		pronostics.Pronostics_ScoreEquipeVisiteur IS NULL' .
            '					    GROUP BY	Pronostiqueurs_Pronostiqueur' .
            '				) points_marques' .
            '				ON		pronostiqueurs_points_marques.Pronostiqueur = points_marques.Pronostiqueurs_Pronostiqueur' .
            '						  AND		pronostiqueurs_points_marques.Points_Marques = points_marques.Points_Marques' .
            '	JOIN		  pronostiqueurs' .
            '				    ON		pronostiqueurs_points_marques.Pronostiqueur = pronostiqueurs.Pronostiqueur' .
            '	ORDER BY	pronostiqueurs.Pronostiqueurs_NomUtilisateur, pronostiqueurs_points_marques.Points_Marques DESC';
  $query = $db->query($sql);
	$points = $query->fetchAll();

  $forecastersAndPoints = array();
  $POINTS_COUNT = 10;

  for($i = 0; $i < count($forecasters); $i++) {
    $currentForecaster = array("Pronostiqueur" => $forecasters[$i]["Pronostiqueur"], "Pronostiqueurs_NomUtilisateur" => $forecasters[$i]["Pronostiqueurs_NomUtilisateur"]);
    $currentForecasterPoints = array();
    $correctResults = 0;
    for($j = 0; $j < $POINTS_COUNT; $j++) {
      if($j <= 4)
        $correctResults += $points[$i * $POINTS_COUNT + $j]["Nombre"];
		  array_push($currentForecasterPoints, $points[$i * $POINTS_COUNT + $j]["Nombre"]);

      if($j == 4)
        array_push($currentForecasterPoints, $correctResults);
    }

    array_push($forecastersAndPoints, array("Pronostiqueur" => $currentForecaster, "Points" => $currentForecasterPoints));
  }

  echo json_encode($forecastersAndPoints);

?>