<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $viewedForecaster = $postedData["pronostiqueur"];

  // Lecture de l'évolution du classement du pronostiqueur pour ses championnats
  $sql =		'	SELECT		Championnat, Championnats_Nom' .
            '	FROM		  inscriptions' .
            '	JOIN		  championnats' .
            '				    ON		inscriptions.Championnats_Championnat = championnats.Championnat' .
            '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
            '				    AND		Championnats_Championnat NOT IN (4, 5)' .
            '	ORDER BY	Championnats_Championnat';
  $query = $db->query($sql);
  $championships = $query->fetchAll();

  $forecasterStandings = array();

  // Parcours des championnats du pronostiqueur
  foreach($championships as $championship) {
    // Nombre de pronostiqueurs (et qui donne l'échelle verticale)
    $sql =		'	SELECT		COUNT(*) AS Nombre_Pronostiqueurs FROM inscriptions WHERE Championnats_Championnat = ' . $championship["Championnat"];
    $query = $db->query($sql);
    $forecasters = $query->fetchAll();
    $countForecasters = $forecasters[0]["Nombre_Pronostiqueurs"];

    // Meilleur et plus mauvais classements (classement général)
    $sql =		'	SELECT		MAX(Classements_ClassementGeneralMatch) AS Classement_Max' .
              '				    ,MIN(Classements_ClassementGeneralMatch) AS Classement_Min' .
              '	FROM		  vue_classements_uniques' .
              '	JOIN		  journees' .
              '				    ON		vue_classements_uniques.Journees_Journee = journees.Journee' .
              '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
              '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
              '				    AND		vue_classements_uniques.Classements_ClassementGeneralMatch IS NOT NULL';
    $query = $db->query($sql);
    $standingsMinAndMax = $query->fetchAll();
    $standingMin = $standingsMinAndMax[0]["Classement_Min"];
    $standingMax = $standingsMinAndMax[0]["Classement_Max"];

    // Meilleur et plus mauvais classements (classement général buteur)
    $sql =		'	SELECT		MAX(Classements_ClassementGeneralButeur) AS Classement_Max' .
              '				    ,MIN(Classements_ClassementGeneralButeur) AS Classement_Min' .
              '	FROM		  vue_classements_uniques' .
              '	JOIN		  journees' .
              '				    ON		vue_classements_uniques.Journees_Journee = journees.Journee' .
              '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
              '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
              '				    AND		vue_classements_uniques.Classements_ClassementGeneralButeur IS NOT NULL';
    $query = $db->query($sql);
    $standingsGoalsMinAndMax = $query->fetchAll();
    $standingGoalsMin = $standingsGoalsMinAndMax[0]["Classement_Min"];
    $standingGoalsMax = $standingsGoalsMinAndMax[0]["Classement_Max"];

    // Meilleur et plus mauvais classements (classement journée)
    $sql =		'	SELECT		MAX(Classements_ClassementJourneeMatch) AS Classement_Max' .
              '				    ,MIN(Classements_ClassementJourneeMatch) AS Classement_Min' .
              '	FROM		  vue_classements_uniques' .
              '	JOIN		  journees' .
              '				    ON		vue_classements_uniques.Journees_Journee = journees.Journee' .
              '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
              '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
              '				    AND		vue_classements_uniques.Classements_ClassementJourneeMatch IS NOT NULL';
    $query = $db->query($sql);
    $standingsWeeksMinAndMax = $query->fetchAll();
    $standingWeeksMin = $standingsWeeksMinAndMax[0]["Classement_Min"];
    $standingWeeksMax = $standingsWeeksMinAndMax[0]["Classement_Max"];

    // Classements occupés (classements général, général buteur et journée)
    $sql =		'	SELECT    *' .
              ' FROM      (' .
              '             SELECT		1 AS Type_Classement, Classements_ClassementGeneralMatch AS Classements_Classement, vue_classements_uniques.Journees_Journee' .
              '	            FROM		  vue_classements_uniques' .
              '	            JOIN		  journees' .
              '				                ON		vue_classements_uniques.Journees_Journee = journees.Journee' .
              '	            WHERE		  journees.Championnats_Championnat = ' . $championship["Championnat"] .
              '				                AND		vue_classements_uniques.Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
              '				                AND		vue_classements_uniques.Classements_ClassementGeneralMatch IS NOT NULL' .
              '             UNION ALL' .
              '             SELECT		2 AS Type_Classement, Classements_ClassementGeneralButeur AS Classements_Classement, vue_classements_uniques.Journees_Journee' .
              '	            FROM		  vue_classements_uniques' .
              '	            JOIN		  journees' .
              '				                ON		vue_classements_uniques.Journees_Journee = journees.Journee' .
              '	            WHERE		  journees.Championnats_Championnat = ' . $championship["Championnat"] .
              '				                AND		vue_classements_uniques.Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
              '				                AND		vue_classements_uniques.Classements_ClassementGeneralButeur IS NOT NULL' .
              '             UNION ALL' .
              '	            SELECT		3 AS Type_Classement, Classements_ClassementJourneeMatch AS Classements_Classement, vue_classements_uniques.Journees_Journee' .
              '	            FROM		  vue_classements_uniques' .
              '	            JOIN		  journees' .
              '	            			    ON		vue_classements_uniques.Journees_Journee = journees.Journee' .
              '	            WHERE		  journees.Championnats_Championnat = ' . $championship["Championnat"] .
              '	            			    AND		vue_classements_uniques.Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
              '	            			    AND		vue_classements_uniques.Classements_ClassementJourneeMatch IS NOT NULL' .
              '           ) classements' .
              '	ORDER BY	classements.Journees_Journee, Type_Classement';
    $query = $db->query($sql);
    $standings = $query->fetchAll();
    $weeksCount = sizeof($standings) / 3;

    // Ajout des classements (classements général et journée)
    $championshipStandings = array( "Championnat" => $championship["Championnat"]
                                    ,"Championnats_Nom" => $championship["Championnats_Nom"]
                                    ,"Nombre_Pronostiqueurs" => $countForecasters
                                    ,"Nombre_Journees" => $weeksCount
                                    ,"Classements" => $standings
                                    ,"Classement_Min" => $standingMin
                                    ,"Classement_Max" => $standingMax
                                    ,"ClassementButeur_Min" => $standingGoalsMin
                                    ,"ClassementButeur_Max" => $standingGoalsMax
                                    ,"ClassementJournee_Min" => $standingWeeksMin
                                    ,"ClassementJournee_Max" => $standingWeeksMax
                                    ,"Nombre_Classements" => 3);

    array_push($forecasterStandings, $championshipStandings);
  }

  echo json_encode($forecasterStandings);

?>