<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $forecaster = json_decode($postedData["pronostiqueur"]);
  $match = json_decode($postedData["match"]);

  // Lecture des données d'un match normal (de type 1, 4 ou 5)
  $sql =		'	SELECT      DISTINCT matches.Match, matches.Matches_Nom' .
            '							,matches.Matches_Date' .
            '							,CASE' .
            '								WHEN	matches.Matches_AvecProlongation = 1 AND matches.Matches_MatchLie <> 0' .
            '								THEN	matches_lies.Matches_Date' .
            '								ELSE	matches.Matches_Date' .
            '							END AS Matches_DateMax' .
            '							,equipes_domicile.Equipe AS EquipesDomicile_Equipe, equipes_visiteur.Equipe AS EquipesVisiteur_Equipe' .
            '							,equipes_domicile.Equipes_Nom AS EquipesDomicile_Nom, equipes_visiteur.Equipes_Nom AS EquipesVisiteur_Nom' .
            '							,equipes_domicile.Equipes_NomCourt AS EquipesDomicile_NomCourt, equipes_visiteur.Equipes_NomCourt AS EquipesVisiteur_NomCourt' .
            '							,equipes_domicile.Equipes_Fanion AS EquipesDomicile_Fanion, equipes_visiteur.Equipes_Fanion AS EquipesVisiteur_Fanion' .
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
            '							,CASE' .
            '               WHEN  journees.Championnats_Championnat <> 5 AND matches.Matches_FinaleEuropeenne = 0' .
            '               THEN  fn_calculcotematch(matches.Matches_CoteEquipeDomicile)' .
            '               ELSE  matches_lies.Matches_PointsQualificationEquipeDomicile' .
            '             END AS Matches_CoteEquipeDomicile' .
            '							,CASE' .
            '               WHEN  journees.Championnats_Championnat <> 5 AND matches.Matches_FinaleEuropeenne = 0' .
            '               THEN  fn_calculcotematch(matches.Matches_CoteNul)' .
            '             END AS Matches_CoteNul' .
            '							,CASE' .
            '               WHEN  journees.Championnats_Championnat <> 5 AND matches.Matches_FinaleEuropeenne = 0' .
            '               THEN  fn_calculcotematch(matches.Matches_CoteEquipeVisiteur)' .
            '               ELSE  matches_lies.Matches_PointsQualificationEquipeVisiteur' .
            '             END AS Matches_CoteEquipeVisiteur' .
            '             ,matches_lies.Matches_PointsQualificationEquipeDomicile AS Matches_PointsQualificationEquipeVisiteur' .
            '             ,matches_lies.Matches_PointsQualificationEquipeVisiteur AS Matches_PointsQualificationEquipeDomicile' .
            '							,pronostics.Pronostics_ScoreEquipeDomicile, pronostics.Pronostics_ScoreEquipeVisiteur' .
            '							,pronostics.Pronostics_ScoreAPEquipeDomicile, pronostics.Pronostics_ScoreAPEquipeVisiteur' .
            '							,pronostics.Pronostics_Vainqueur' .
            '							,(SELECT Pronostics_ScoreEquipeDomicile FROM pronostics WHERE Pronostiqueurs_pronostiqueur = ' . $forecaster . ' AND Matches_Match = matches.Matches_MatchLie) AS PronosticsLies_ScoreEquipeDomicile' .
            '							,(SELECT Pronostics_ScoreEquipeVisiteur FROM pronostics WHERE Pronostiqueurs_Pronostiqueur = ' . $forecaster . ' AND Matches_Match = matches.Matches_MatchLie) AS PronosticsLies_ScoreEquipeVisiteur' .
            '							,(SELECT Pronostics_ScoreAPEquipeDomicile FROM pronostics WHERE Pronostiqueurs_pronostiqueur = ' . $forecaster . ' AND Matches_Match = matches.Matches_MatchLie) AS PronosticsLies_ScoreAPEquipeDomicile' .
            '							,(SELECT Pronostics_ScoreAPEquipeVisiteur FROM pronostics WHERE Pronostiqueurs_Pronostiqueur = ' . $forecaster . ' AND Matches_Match = matches.Matches_MatchLie) AS PronosticsLies_ScoreAPEquipeVisiteur' .
            '							,fn_matchpronostiquable(matches.Match, ' . $forecaster . ') AS Matches_Pronostiquable' .
            '							,CASE' .
            '								WHEN	matches.Matches_Date > NOW() AND (pronostics_carrefinal.PronosticsCarreFinal_Coefficient IS NULL OR pronostics_carrefinal.PronosticsCarreFinal_Coefficient <> 0)' .
            '								THEN	1' .
            '								ELSE	0' .
            '							END AS Buteurs_Pronostiquables' .
            '							,CASE' .
            '								WHEN	IFNULL(matches.Matches_SansButeur, 0) = 1' .
            '								THEN	1' .
            '								ELSE	0' .
            '							END AS Matches_SansButeur' .
            '							,matches.Matches_L1EuropeNom' .
            '							,matches.Matches_L1Europe' .
            '							,matches.Matches_Coefficient' .
            '							,CASE' .
            '								WHEN	matches.Matches_DemiFinaleEuropeenne = 1 OR matches.Matches_FinaleEuropeenne = 1' .
            '								THEN	1' .
            '								ELSE	0' .
            '							END AS Afficher_CoefficientCarreFinal' .
            '							,PronosticsCarreFinal_Coefficient' .
            '             ,matches.Matches_FinaleEuropeenne' .
            '							,IFNULL(matches.Matches_FinaleEuropeenne, 0) AS Matches_FinaleEuropeenne' .
            '             ,matches.Matches_Date, journees.Championnats_Championnat' .
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
            '							AND		inscriptions.Pronostiqueurs_Pronostiqueur = pronostics.Pronostiqueurs_Pronostiqueur' .
            '	LEFT JOIN		matches matches_lies' .
            '							ON		matches.Matches_MatchLie = matches_lies.Match' .
            '	LEFT JOIN		pronostics_carrefinal' .
            '							ON		matches.Match = pronostics_carrefinal.Matches_Match' .
            '									  AND		inscriptions.Pronostiqueurs_Pronostiqueur = pronostics_carrefinal.Pronostiqueurs_Pronostiqueur' .
            '	WHERE				matches.Match = ' . $match .
            '             AND   journees.Journees_Active = 1' .
            '							AND		inscriptions.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
            '							AND		matches.Equipes_EquipeDomicile IS NOT NULL' .
            '							AND		matches.Equipes_EquipeVisiteur IS NOT NULL' .
            '	ORDER BY		CASE' .
            '               WHEN  journees.Championnats_Championnat IN (1, 5)' .
            '               THEN  matches.Matches_Date' .
            '               ELSE  matches.Match' .
            '             END';
  $query = $db->query($sql);
  $match = $query->fetchAll();

  echo json_encode($match[0]);

?>
