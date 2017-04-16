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
	$sql =		'	SELECT		  IFNULL(equipes.Equipes_NomCourt, Equipes_Nom) AS Equipes_NomCourt' .
            '             ,IFNULL(SUM(Scores_ScoreMatch + Scores_ScoreButeur + Scores_ScoreBonus), 0) AS Scores' .
            '	FROM		    (' .
            '					      SELECT		Pronostiqueur, Equipes_Equipe' .
            '					      FROM		  pronostiqueurs' .
            '					      FULL JOIN	engagements' .
            '					      JOIN		  equipes' .
            '					      			    ON		Equipes_Equipe = equipes.Equipe' .
            '					      WHERE		  Championnats_Championnat = ' . $championship .
            '					      			    AND		equipes.Equipes_L1Europe IS NULL' .
            '				      ) pronostiqueurs_equipes' .
            '	LEFT JOIN	  (' .
            '					      SELECT		scores.Pronostiqueurs_Pronostiqueur, matches.Equipes_EquipeDomicile AS Equipes_Equipe' .
            '								          ,IFNULL(Scores_ScoreMatch, 0) AS Scores_ScoreMatch, IFNULL(Scores_ScoreButeur, 0) AS Scores_ScoreButeur, IFNULL(Scores_ScoreBonus, 0) AS Scores_ScoreBonus' .
            '					      FROM		  scores' .
            '					      JOIN	  	matches' .
            '					      			    ON		scores.Matches_Match = matches.Match' .
            '					      JOIN		  journees' .
            '					      			    ON		matches.Journees_Journee = journees.Journee' .
            '					      JOIN		  equipes' .
            '					      			    ON		matches.Equipes_EquipeDomicile = equipes.Equipe' .
            '					      WHERE		  journees.Championnats_Championnat = ' . $championship .
            '					      			    AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
            '					      			    AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
            '					      			    AND		equipes.Equipes_L1Europe IS NULL' .
            '					      UNION ALL' .
            '					      SELECT		scores.Pronostiqueurs_Pronostiqueur, matches.Equipes_EquipeVisiteur AS Equipes_Equipe' .
            '					      			    ,IFNULL(Scores_ScoreMatch, 0) AS Scores_ScoreMatch, IFNULL(Scores_ScoreButeur, 0) AS Scores_ScoreButeur, IFNULL(Scores_ScoreBonus, 0) AS Scores_ScoreBonus' .
            '					      FROM		  scores' .
            '					      JOIN		  matches' .
            '					      			    ON		scores.Matches_Match = matches.Match' .
            '					      JOIN		  journees' .
            '					      			    ON		matches.Journees_Journee = journees.Journee' .
            '					      JOIN		  equipes' .
            '					      			    ON		matches.Equipes_EquipeVisiteur = equipes.Equipe' .
            '					      WHERE		  journees.Championnats_Championnat = ' . $championship .
            '					      			    AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
            '					      			    AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
            '					      			    AND		equipes.Equipes_L1Europe IS NULL' .
            '				      ) scores' .
            '				      ON		pronostiqueurs_equipes.Pronostiqueur = scores.Pronostiqueurs_Pronostiqueur' .
            '						        AND		pronostiqueurs_equipes.Equipes_Equipe = scores.Equipes_Equipe' .
            '	LEFT JOIN	  equipes' .
					  '				      ON		pronostiqueurs_equipes.Equipes_Equipe = equipes.Equipe' .
            '	LEFT JOIN	  pronostiqueurs' .
            '				      ON		pronostiqueurs_equipes.Pronostiqueur = pronostiqueurs.Pronostiqueur' .
            ' LEFT JOIN   pronostiqueurs_rivaux' .
            '             ON    pronostiqueurs_rivaux.Pronostiqueur = ' . $forecaster .
            '                   AND   pronostiqueurs.Pronostiqueur = pronostiqueurs_rivaux.PronostiqueursRivaux_Pronostiqueur' .
            '	GROUP BY	  pronostiqueurs_equipes.Pronostiqueur, pronostiqueurs_equipes.Equipes_Equipe' .
            '	ORDER BY	  pronostiqueurs.Pronostiqueurs_NomUtilisateur, IFNULL(equipes.Equipes_NomCourt, equipes.Equipes_Nom)';
	$query = $db->query($sql);
	$points = $query->fetchAll();

  $forecastersTeamPoints = array();
  for($i = 0; $i < $forecastersCount; $i++) {
    $forecasterTeamPoints = array();
    $currentForecaster = $forecasters[$i]["Pronostiqueurs_NomUtilisateur"];
    $isRival = $forecasters[$i]["Pronostiqueurs_Rival"];

    for($j = 0; $j < $teamsCount; $j++) {
      $teamPoints = array(
        "Scores" => $points[($i * $teamsCount) + $j]["Scores"]
      );
      array_push($forecasterTeamPoints, $teamPoints);
    }
    array_push($forecastersTeamPoints, $forecasterTeamPoints);
  }

  $tp = array();
  $tp['Pronostiqueurs'] = $forecasters;
  $tp['Equipes'] = $teams;
  $tp['Donnees'] = $forecastersTeamPoints;
  echo json_encode($tp);

?>