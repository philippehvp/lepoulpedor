<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $viewedForecaster = $postedData["pronostiqueur"];
  $championship = $postedData["championnat"];

  $forecasterStandings = array();

  // Nombre de pronostiqueurs (et qui donne l'échelle verticale)
  $sql =		'	SELECT		COUNT(*) AS Nombre_Pronostiqueurs FROM inscriptions WHERE Championnats_Championnat = ' . $championship;
  $query = $db->query($sql);
  $forecasters = $query->fetchAll();
  $countForecasters = $forecasters[0]["Nombre_Pronostiqueurs"];

  // Meilleur et plus mauvais classements (classement général)
  $sql =		'	SELECT		MAX(Classements_ClassementJourneeMatch) AS Classement_Max' .
            '				    ,MIN(Classements_ClassementJourneeMatch) AS Classement_Min' .
            '	FROM		  vue_classements_uniques' .
            '	JOIN		  journees' .
            '				    ON		vue_classements_uniques.Journees_Journee = journees.Journee' .
            '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
            '				    AND		journees.Championnats_Championnat = ' . $championship .
            '				    AND		vue_classements_uniques.Classements_ClassementJourneeMatch IS NOT NULL';
  $query = $db->query($sql);
  $standingsMinAndMax = $query->fetchAll();
  $standingMin = $standingsMinAndMax[0]["Classement_Min"];
  $standingMax = $standingsMinAndMax[0]["Classement_Max"];

  // Classements occupés
  $sql =		'	SELECT    *' .
            ' FROM      (' .
            '             SELECT		1 AS Type_Classement, Classements_ClassementJourneeMatch AS Classements_Classement, vue_classements_uniques.Journees_Journee' .
            '	            FROM		  vue_classements_uniques' .
            '	            JOIN		  journees' .
            '				                ON		vue_classements_uniques.Journees_Journee = journees.Journee' .
            '	            WHERE		  journees.Championnats_Championnat = ' . $championship .
            '				                AND		vue_classements_uniques.Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
            '				                AND		vue_classements_uniques.Classements_ClassementJourneeMatch IS NOT NULL' .
            '           ) classements' .
            '	ORDER BY	classements.Journees_Journee, Type_Classement';
  $query = $db->query($sql);
  $standings = $query->fetchAll();
  $weeksCount = sizeof($standings) / 1;

  // Ajout des classements
  $championshipStandings = array( "Championnat" => $championship
                                  ,"Championnats_Nom" => $championship["Championnats_Nom"]
                                  ,"Nombre_Pronostiqueurs" => $countForecasters
                                  ,"Nombre_Journees" => $weeksCount
                                  ,"Classements" => $standings
                                  ,"Classement_Min" => $standingMin
                                  ,"Classement_Max" => $standingMax
                                  ,"Nombre_Classements" => 2);

  echo json_encode($championshipStandings);

?>