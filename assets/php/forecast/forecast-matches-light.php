<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $forecaster = json_decode($postedData["pronostiqueur"]);
  $week = json_decode($postedData["journee"]);

  $sql =		'	SELECT      DISTINCT matches.Match, equipes_domicile.Equipe AS EquipesDomicile_Equipe, equipes_visiteur.Equipe AS EquipesVisiteur_Equipe' .
            '							,UPPER(IFNULL(equipes_domicile.Equipes_Sigle, equipes_domicile.Equipes_NomCourt)) AS EquipesDomicile_Sigle' .
            '             ,UPPER(IFNULL(equipes_visiteur.Equipes_Sigle, equipes_visiteur.Equipes_NomCourt)) AS EquipesVisiteur_Sigle' .
            '							,equipes_domicile.Equipes_Fanion AS EquipesDomicile_Fanion, equipes_visiteur.Equipes_Fanion AS EquipesVisiteur_Fanion' .
            '							,fn_matchpronostiquable(matches.Match, ' . $forecaster . ') AS Matches_Pronostiquable' .
            '             ,matches.Matches_Date, journees.Championnats_Championnat' .
            '             ,CASE' .
            '                 WHEN  matches.Matches_MatchCS = 1' .
            '                 THEN  5' .
            '                 WHEN  matches.Matches_AvecProlongation = 0 AND matches.Matches_MatchLie IS NULL' .
            '                 THEN  1' .
            '                 WHEN  matches.Matches_AvecProlongation = 0 AND matches.Matches_MatchLie IS NOT NULL' .
            '                 THEN  2' .
            '                 WHEN  matches.Matches_AvecProlongation = 1 AND matches.Matches_MatchLie IS NOT NULL' .
            '                 THEN  3' .
            '                 ELSE  4' .
            '             END AS Matches_TypeMatch' .
            '	FROM				matches' .
            '	JOIN				journees' .
            '							ON		matches.Journees_Journee = journees.Journee' .
            '	JOIN				inscriptions' .
            '							ON		journees.Championnats_Championnat = inscriptions.Championnats_Championnat' .
            '	LEFT JOIN		equipes AS equipes_domicile' .
            '							ON		matches.Equipes_EquipeDomicile = equipes_domicile.Equipe' .
            '	LEFT JOIN		equipes AS equipes_visiteur' .
            '							ON		matches.Equipes_EquipeVisiteur = equipes_visiteur.Equipe' .
            '	LEFT JOIN		pronostics' .
            '							ON		matches.Match = pronostics.Matches_Match' .
            '							      AND		inscriptions.Pronostiqueurs_Pronostiqueur = pronostics.Pronostiqueurs_Pronostiqueur' .
            '	LEFT JOIN		matches matches_lies' .
            '							ON		matches.Matches_MatchLie = matches_lies.Match' .
            '	LEFT JOIN		pronostics_carrefinal' .
            '							ON		matches.Match = pronostics_carrefinal.Matches_Match' .
            '							  		AND		inscriptions.Pronostiqueurs_Pronostiqueur = pronostics_carrefinal.Pronostiqueurs_Pronostiqueur' .
            '	WHERE				journees.Journee = ' . $week .
            '             AND   journees.Journees_Active = 1' .
            '							AND		inscriptions.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
            '							AND		matches.Equipes_EquipeDomicile IS NOT NULL' .
            '							AND		matches.Equipes_EquipeVisiteur IS NOT NULL' .
            '             AND   NOT(matches.Matches_AvecProlongation = 1 AND matches.Matches_MatchLie IS NOT NULL)' .
            '	ORDER BY		CASE' .
            '               WHEN  journees.Championnats_Championnat IN (1, 5)' .
            '               THEN  matches.Matches_Date' .
            '               ELSE  matches.Match' .
            '             END';
  $query = $db->query($sql);
  $matchesLight = $query->fetchAll();

  echo json_encode($matchesLight);

?>
