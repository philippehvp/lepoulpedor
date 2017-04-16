<?php

  function readForecasters($db, $forecaster, $championship) {
    // Liste des pronostiqueurs pour un championnat
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
    return $forecasters;
  }

  function readTeams($db, $championship) {
  	// Equipes du championnat
    $sql =		'	SELECT		IFNULL(Equipes_NomCourt, Equipes_Nom) AS Equipes_NomCourt' .
              '	FROM		  equipes' .
              '	JOIN		  engagements' .
              '				    ON		equipes.Equipe = engagements.Equipes_Equipe' .
              '	WHERE		  engagements.Championnats_Championnat = ' . $championship .
              '				    AND		equipes.Equipes_L1Europe IS NULL' .
              '	ORDER BY	IFNULL(Equipes_NomCourt, Equipes_Nom)';
    $query = $db->query($sql);
    $teams = $query->fetchAll();
    return $teams;
  }


?>