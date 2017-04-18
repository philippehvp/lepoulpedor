<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $forecaster = json_decode($postedData["pronostiqueur"]);
  $singleMatchNumber = json_decode($postedData["match"]);

  // Lecture des données d'un match simple (de type 1, 4 ou 5)

  // Logistique et pronostics
  $sql =		'	SELECT      DISTINCT matches.Match, matches.Matches_Date, matches.Matches_Nom' .
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
            '             ,fn_calculcotematch(matches.Matches_CoteEquipeDomicile) AS Matches_CoteEquipeDomicile' .
            '             ,fn_calculcotematch(matches.Matches_CoteNul) AS Matches_CoteNul' .
            '             ,fn_calculcotematch(matches.Matches_CoteEquipeVisiteur) AS Matches_CoteEquipeVisiteur' .
            '             ,matches.Matches_PointsQualificationEquipeDomicile' .
            '             ,matches.Matches_PointsQualificationEquipeVisiteur' .
            '							,pronostics.Pronostics_ScoreEquipeDomicile, pronostics.Pronostics_ScoreEquipeVisiteur' .
            '							,pronostics.Pronostics_ScoreAPEquipeDomicile, pronostics.Pronostics_ScoreAPEquipeVisiteur' .
            '							,pronostics.Pronostics_Vainqueur' .
            '							,fn_matchpronostiquable(matches.Match, ' . $forecaster . ') AS Matches_Pronostiquable' .
            '							,CASE' .
            '								WHEN	matches.Matches_Date > NOW() AND (pronostics_carrefinal.PronosticsCarreFinal_Coefficient IS NULL OR pronostics_carrefinal.PronosticsCarreFinal_Coefficient <> 0)' .
            '								THEN	1' .
            '								ELSE	0' .
            '							END AS Buteurs_Pronostiquables' .
            '							,CASE' .
            '								WHEN	matches.Matches_DemiFinaleEuropeenne = 1 OR matches.Matches_FinaleEuropeenne = 1' .
            '								THEN	1' .
            '								ELSE	0' .
            '							END AS Afficher_CoefficientCarreFinal' .
            '							,PronosticsCarreFinal_Coefficient' .
            '             ,matches.Matches_FinaleEuropeenne' .
            '							,IFNULL(matches.Matches_SansButeur, 0) AS Matches_SansButeur' .
            '							,matches.Matches_L1EuropeNom' .
            '							,matches.Matches_L1Europe' .
            '							,matches.Matches_Coefficient' .
            '             ,journees.Championnats_Championnat' .
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
            '	WHERE				matches.Match = ' . $singleMatchNumber .
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
  $singleMatch = $query->fetchAll();

  // Buteurs équipe domicile
  $sql =    ' SELECT    pronostics_buteurs.Joueurs_Joueur, TRIM(CONCAT(joueurs.Joueurs_NomFamille, \' \', IFNULL(joueurs.Joueurs_Prenom, \'\'))) AS Joueurs_NomComplet' .
						'	FROM			pronostics_buteurs' .
						'	JOIN			joueurs_equipes' .
						'					  ON		pronostics_buteurs.Joueurs_Joueur = joueurs_equipes.Joueurs_Joueur' .
						'	JOIN			joueurs' .
						'					  ON		joueurs_equipes.Joueurs_Joueur = joueurs.Joueur' .
						'	JOIN			matches' .
						'					  ON		pronostics_buteurs.Matches_Match = matches.Match' .
            ' JOIN      journees' .
            '           ON    matches.Journees_Journee = journees.Journee' .
						'	JOIN			inscriptions' .
						'					  ON		journees.Championnats_Championnat = inscriptions.Championnats_Championnat' .
						'					        AND		pronostics_buteurs.Pronostiqueurs_Pronostiqueur = inscriptions.Pronostiqueurs_Pronostiqueur' .
						'	WHERE			matches.Match = ' . $singleMatchNumber .
						'					  AND		pronostics_buteurs.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
						'					  AND		JoueursEquipes_Debut <= matches.Matches_Date' .
						'					  AND		(JoueursEquipes_Fin IS NULL OR JoueursEquipes_Fin > matches.Matches_Date)' .
            '           AND   pronostics_buteurs.Equipes_Equipe = matches.Equipes_EquipeDomicile';
  $query = $db->query($sql);
  $singleMatchScorersA = $query->fetchAll();

  // Buteurs équipe visiteur
  $sql =    ' SELECT    pronostics_buteurs.Joueurs_Joueur, TRIM(CONCAT(joueurs.Joueurs_NomFamille, \' \', IFNULL(joueurs.Joueurs_Prenom, \'\'))) AS Joueurs_NomComplet' .
						'	FROM			pronostics_buteurs' .
						'	JOIN			joueurs_equipes' .
						'					  ON		pronostics_buteurs.Joueurs_Joueur = joueurs_equipes.Joueurs_Joueur' .
						'	JOIN			joueurs' .
						'					  ON		joueurs_equipes.Joueurs_Joueur = joueurs.Joueur' .
						'	JOIN			matches' .
						'					  ON		pronostics_buteurs.Matches_Match = matches.Match' .
            ' JOIN      journees' .
            '           ON    matches.Journees_Journee = journees.Journee' .
						'	JOIN			inscriptions' .
						'					  ON		journees.Championnats_Championnat = inscriptions.Championnats_Championnat' .
						'					        AND		pronostics_buteurs.Pronostiqueurs_Pronostiqueur = inscriptions.Pronostiqueurs_Pronostiqueur' .
						'	WHERE			matches.Match = ' . $singleMatchNumber .
						'					  AND		pronostics_buteurs.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
						'					  AND		JoueursEquipes_Debut <= matches.Matches_Date' .
						'					  AND		(JoueursEquipes_Fin IS NULL OR JoueursEquipes_Fin > matches.Matches_Date)' .
            '           AND   pronostics_buteurs.Equipes_Equipe = matches.Equipes_EquipeVisiteur';
  $query = $db->query($sql);
  $singleMatchScorersB = $query->fetchAll();

  // Joueurs équipe domicile
	$sql =		'	SELECT		  joueurs.Joueur' .
							'				    ,TRIM(CONCAT(joueurs.Joueurs_NomFamille, \' \', IFNULL(joueurs.Joueurs_Prenom, \'\'))) AS Joueurs_NomComplet' .
							'				    ,joueurs.Postes_Poste' .
							'				    ,CASE' .
							'					    WHEN	joueurs_cotes.JoueursCotes_Cote IS NULL' .
							'					    THEN	\'?\'' .
							'					    ELSE	fn_calculcotebuteur(JoueursCotes_Cote)' .
							'				    END AS JoueursCotes_Cote' .
							'	FROM		  joueurs' .
							'	JOIN		  joueurs_equipes' .
							'				    ON		joueurs.Joueur = joueurs_equipes.Joueurs_Joueur' .
							'	JOIN		  matches' .
							'				    ON		joueurs_equipes.Equipes_Equipe = matches.Equipes_EquipeDomicile' .
							'	LEFT JOIN	joueurs_cotes' .
							'				    ON		matches.Match = joueurs_cotes.Matches_Match' .
							'						      AND		joueurs.Joueur = joueurs_cotes.Joueurs_Joueur' .
							'						      AND		joueurs_equipes.Equipes_Equipe = joueurs_cotes.Equipes_Equipe' .
							'	WHERE		  JoueursEquipes_Debut <= matches.Matches_Date' .
							'				    AND		(JoueursEquipes_Fin IS NULL OR JoueursEquipes_Fin > matches.Matches_Date)' .
							'				    AND		matches.Match = ' . $singleMatchNumber .
							'				    AND		joueurs.Postes_Poste <> 1' .
							'	ORDER BY	joueurs.Postes_Poste DESC, joueurs_equipes.Joueurs_Joueur DESC';
	$query = $db->query($sql);
	$singleMatchPlayersA = $query->fetchAll();

  // Joueurs équipe visiteur
	$sql =		'	SELECT		  joueurs.Joueur' .
							'				    ,TRIM(CONCAT(joueurs.Joueurs_NomFamille, \' \', IFNULL(joueurs.Joueurs_Prenom, \'\'))) AS Joueurs_NomComplet' .
							'				    ,joueurs.Postes_Poste' .
							'				    ,CASE' .
							'					    WHEN	joueurs_cotes.JoueursCotes_Cote IS NULL' .
							'					    THEN	\'?\'' .
							'					    ELSE	fn_calculcotebuteur(JoueursCotes_Cote)' .
							'				    END AS JoueursCotes_Cote' .
							'	FROM		  joueurs' .
							'	JOIN		  joueurs_equipes' .
							'				    ON		joueurs.Joueur = joueurs_equipes.Joueurs_Joueur' .
							'	JOIN		  matches' .
							'				    ON		joueurs_equipes.Equipes_Equipe = matches.Equipes_EquipeVisiteur' .
							'	LEFT JOIN	joueurs_cotes' .
							'				    ON		matches.Match = joueurs_cotes.Matches_Match' .
							'						      AND		joueurs.Joueur = joueurs_cotes.Joueurs_Joueur' .
							'						      AND		joueurs_equipes.Equipes_Equipe = joueurs_cotes.Equipes_Equipe' .
							'	WHERE		  JoueursEquipes_Debut <= matches.Matches_Date' .
							'				    AND		(JoueursEquipes_Fin IS NULL OR JoueursEquipes_Fin > matches.Matches_Date)' .
							'				    AND		matches.Match = ' . $singleMatchNumber .
							'				    AND		joueurs.Postes_Poste <> 1' .
							'	ORDER BY	joueurs.Postes_Poste DESC, joueurs_equipes.Joueurs_Joueur DESC';
	$query = $db->query($sql);
	$singleMatchPlayersB = $query->fetchAll();

  $single = array();

  array_push($single, array(
    "match" => $singleMatch
    , "buteurs_domicile" => $singleMatchScorersA
    , "buteurs_visiteur" => $singleMatchScorersB
    , "joueurs_domicile" => $singleMatchPlayersA
    , "joueurs_visiteur" => $singleMatchPlayersB
  ));

  echo json_encode($single);

?>
