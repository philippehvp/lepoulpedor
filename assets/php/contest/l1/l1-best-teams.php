<?php
  include_once('common.php');
  include_once('l1-common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];

  $forecaster = isset($forecaster) ? $forecaster : 0;

  // Liste des équipes du championnat
  $teams = readTeams($db, $championship);
	$teamsCount = sizeof($teams);

	// Liste des pronostiqueurs pour le championnat en question
	$forecasters = readForecasters($db, $forecaster, $championship);
	$forecastersCount = sizeof($forecasters);

  // Points marqués par équipe
	$sql =		'	SELECT		IFNULL(equipes.Equipes_NomCourt, equipes.Equipes_Nom) AS Equipes_NomCourt, SUM(IFNULL(Scores_ScoreMatch, 0) + IFNULL(Scores_ScoreButeur, 0) + IFNULL(Scores_ScoreBonus, 0)) AS Scores' .
            '	FROM		  (' .
            '					    SELECT		Pronostiqueur, Equipe' .
            '					    FROM		  pronostiqueurs' .
            '					    FULL JOIN	equipes' .
            '					    JOIN		  engagements' .
            '								        ON		Equipe = engagements.Equipes_Equipe' .
            '					    WHERE		  engagements.Championnats_Championnat = ' . $championship .
            '								        AND		Equipes_L1Europe IS NULL' .
            '				    ) pronostiqueurs_equipes' .
            '	LEFT JOIN	scores' .
            '				    ON		pronostiqueurs_equipes.Pronostiqueur = scores.Pronostiqueurs_Pronostiqueur' .
            '	LEFT JOIN	pronostiqueurs' .
            '				    ON		pronostiqueurs_equipes.Pronostiqueur = pronostiqueurs.Pronostiqueur' .
            '	LEFT JOIN	equipes' .
            '				    ON		pronostiqueurs_equipes.Equipe = equipes.Equipe' .
            '	LEFT JOIN	matches' .
            '				    ON		scores.Matches_Match = matches.Match' .
            '						      AND	(	pronostiqueurs_equipes.Equipe IN (matches.Equipes_EquipeDomicile, matches.Equipes_EquipeVisiteur)' .
            '								        OR		matches.Equipes_EquipeDomicile IS NULL' .
            '								        OR		matches.Equipes_EquipeVisiteur IS NULL' .
            '							    )' .
            '	LEFT JOIN	journees' .
            '				    ON		matches.Journees_Journee = journees.Journee' .
            '	WHERE		  journees.Championnats_Championnat = ' . $championship .
            '				    AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
            '				    AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
            '	GROUP BY	pronostiqueurs_equipes.Pronostiqueur, pronostiqueurs_equipes.Equipe' .
            '	ORDER BY	pronostiqueurs.Pronostiqueurs_NomUtilisateur, Scores DESC';
	$query = $db->query($sql);
	$points = $query->fetchAll();
  $teamsCount = count($points) / $forecastersCount;

  $forecastersBestTeams = array();
  for($i = 0; $i < $forecastersCount; $i++) {
    $forecasterBestTeams = array();

    for($j = 0; $j < $teamsCount; $j++) {
      $bestTeams = array(
         "Equipes_NomCourt" => $points[($i * $teamsCount) + $j]["Equipes_NomCourt"]
         ,"Scores" => $points[($i * $teamsCount) + $j]["Scores"]
      );
      array_push($forecasterBestTeams, $bestTeams);
    }
    array_push($forecastersBestTeams, $forecasterBestTeams);
  }

  $bt = array();
  $bt['Pronostiqueurs'] = $forecasters;
  $bt['Equipes'] = $teams;
  $bt['Donnees'] = $forecastersBestTeams;
  echo json_encode($bt);

?>