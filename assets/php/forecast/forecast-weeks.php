<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $forecaster = json_decode($postedData["pronostiqueur"]);

  $sql =		'	SELECT		DISTINCT championnats.Championnat, championnats.Championnats_Nom, championnats.Championnats_NomCourt' .
            '           ,journees.Journee, journees.Journees_Nom, journees.Journees_NomCourt' .
            '	FROM			matches' .
            '	JOIN			journees' .
            '					  ON		matches.Journees_Journee = journees.Journee' .
            '	JOIN			championnats' .
            '					  ON		journees.Championnats_Championnat = championnats.Championnat' .
            '	JOIN			inscriptions' .
            '					  ON		journees.Championnats_Championnat = inscriptions.Championnats_Championnat' .
            '	WHERE			journees.Journees_Active = 1' .
            '					  AND		inscriptions.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
            '					  AND		championnats.Championnat <> 5' .
            '	UNION ALL' .
            '	SELECT		DISTINCT championnats.Championnat, championnats.Championnats_Nom, championnats.Championnats_NomCourt' .
            '           ,journees.Journee, journees.Journees_Nom, journees.Journees_NomCourt' .
            '	FROM			confrontations' .
            '	JOIN			(' .
            '						  SELECT		journees.Journee, journees.Journees_Nom, journees.Journees_NomCourt, journees.Championnats_Championnat' .
            '						  FROM			journees' .
            '						  WHERE			journees.Journees_Active = 1' .
            '										    AND		journees.Championnats_Championnat = 5' .
            '					  ) journees' .
            '					  ON		confrontations.Journees_Journee = journees.Journee' .
            '	JOIN			inscriptions' .
            '					  ON		journees.Championnats_Championnat = inscriptions.Championnats_Championnat' .
            '							    AND		(	confrontations.Pronostiqueurs_PronostiqueurA = inscriptions.Pronostiqueurs_Pronostiqueur' .
            '										      OR		confrontations.Pronostiqueurs_PronostiqueurB = inscriptions.Pronostiqueurs_Pronostiqueur' .
            '									      )' .
            '	JOIN			championnats' .
            '					  ON		journees.Championnats_Championnat = championnats.Championnat' .
            '	WHERE			confrontations.Confrontations_ConfrontationReelle = 1' .
            '					  AND		inscriptions.Pronostiqueurs_Pronostiqueur = ' . $forecaster;
  $query = $db->query($sql);
  $championshipsAndWeeks = $query->fetchAll();

  echo json_encode($championshipsAndWeeks);

?>