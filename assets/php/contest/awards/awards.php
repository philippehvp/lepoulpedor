<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];

  $forecaster = isset($_SESSION["pronostiqueur"]) ? $_SESSION["pronostiqueur"] : 0;

	// Palmarès
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

	$sql =		'	SELECT		pronostiqueurs_trophees.Trophees_CodeTrophee, IFNULL(Nombre_Trophees, 0) AS Nombre_Trophees' .
            '	FROM		  (' .
            '					    SELECT		Pronostiqueur, Trophees_CodeTrophee' .
            '					    FROM		  pronostiqueurs' .
            '					    FULL JOIN	(' .
            '									        SELECT DISTINCT Trophees_CodeTrophee FROM trophees' .
            '								        ) trophees' .
            '					    JOIN		  inscriptions' .
            '								        ON		Pronostiqueur = Pronostiqueurs_Pronostiqueur' .
            '					    WHERE		  Championnats_Championnat = ' . $championship .
            '				    ) pronostiqueurs_trophees' .
            '	LEFT JOIN	(' .
            '					    SELECT		trophees.Pronostiqueurs_Pronostiqueur, Trophees_CodeTrophee, COUNT(*) AS Nombre_Trophees' .
            '					    FROM		  trophees' .
            '					    JOIN		  journees' .
            '								        ON		trophees.Journees_Journee = journees.Journee' .
            '					    WHERE		  journees.Championnats_Championnat = ' . $championship .
            '					    GROUP BY	Pronostiqueurs_Pronostiqueur, Trophees_CodeTrophee' .
            '				    ) trophees' .
            '				    ON		pronostiqueurs_trophees.Pronostiqueur = trophees.Pronostiqueurs_Pronostiqueur' .
            '						      AND		pronostiqueurs_trophees.Trophees_CodeTrophee = trophees.Trophees_CodeTrophee' .
            '	JOIN		  pronostiqueurs' .
            '				    ON		pronostiqueurs_trophees.Pronostiqueur = pronostiqueurs.Pronostiqueur' .
            '	ORDER BY	pronostiqueurs.Pronostiqueurs_NomUtilisateur, pronostiqueurs_trophees.Trophees_CodeTrophee';
	$query = $db->query($sql);
	$awards = $query->fetchAll();

  $forecastersAndAwards = array();
  $AWARDS_COUNT = 8;

  for($i = 0; $i < count($forecasters); $i++) {
    $currentForecaster = array("Pronostiqueur" => $forecasters[$i]["Pronostiqueur"], "Pronostiqueurs_NomUtilisateur" => $forecasters[$i]["Pronostiqueurs_NomUtilisateur"]);
    $currentForecasterAwards = array();
    for($j = 0; $j < $AWARDS_COUNT; $j++)
		  array_push($currentForecasterAwards, $awards[$i * $AWARDS_COUNT + $j]["Nombre_Trophees"]);

    array_push($forecastersAndAwards, array("Pronostiqueur" => $currentForecaster, "Donnees" => $currentForecasterAwards));
  }

  echo json_encode($forecastersAndAwards);

?>