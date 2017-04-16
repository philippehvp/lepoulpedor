<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $viewedForecaster = $postedData["pronostiqueur"];

		// Lecture des statistiques du pronostiqueur pour ses championnats
		$sql =		'	SELECT		Championnat, Championnats_Nom' .
              '	FROM		  inscriptions' .
              '	JOIN		  championnats' .
              '				    ON		inscriptions.Championnats_Championnat = championnats.Championnat' .
              '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
              '				    AND		Championnats_Championnat NOT IN (4, 5)' .
              '	ORDER BY	Championnats_Championnat';
		$query = $db->query($sql);
		$championships = $query->fetchAll();

    $forecasterStats = array();

		// Parcours des championnats du pronostiqueur
		foreach($championships as $championship) {
				// Nombre de buteurs pronostiqués
				$sql =		'	SELECT	COUNT(*) AS Nombre_Pronostics_Buteur' .
                  '	FROM		pronostics_buteurs' .
                  '	JOIN		matches' .
                  '				  ON		pronostics_buteurs.Matches_Match = matches.Match' .
                  '	JOIN		journees' .
                  '				  ON		matches.Journees_Journee = journees.Journee' .
                  '	JOIN		matches_participants' .
                  '				  ON		matches.Match = matches_participants.Matches_Match' .
                  '						    AND		pronostics_buteurs.Joueurs_Joueur = matches_participants.Joueurs_Joueur' .
                  '	WHERE		journees.Championnats_Championnat = ' . $championship["Championnat"] .
                  '				  AND		pronostics_buteurs.Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster;
				$query = $db->query($sql);
				$forecastsGoal = $query->fetchAll();
				$countForecastsGoal = $forecastsGoal[0]["Nombre_Pronostics_Buteur"];
				
				// Nombre de buteurs trouvés
				$sql =		'	SELECT		COUNT(*) AS Nombre_Buteurs_Trouves' .
                  '	FROM		  (' .
                  '					    SELECT		pronostics_buteurs.Matches_Match' .
                  '					    			    ,pronostics_buteurs.Joueurs_Joueur' .
                  '					    			    ,pronostics_buteurs.Equipes_Equipe' .
                  '					    			    ,CASE' .
                  '					    				    WHEN	@match = pronostics_buteurs.Matches_Match' .
                  '					    					  	    AND		@joueur = pronostics_buteurs.Joueurs_Joueur' .
                  '					    					  	    AND		@equipe = pronostics_buteurs.Equipes_Equipe' .
                  '					    				    THEN	@indicePronostics := @indicePronostics + 1' .
                  '					    				    ELSE	(@indicePronostics := 1) AND (@match := pronostics_buteurs.Matches_Match) AND (@joueur := pronostics_buteurs.Joueurs_Joueur) AND (@equipe := pronostics_buteurs.Equipes_Equipe)' .
                  '					    			    END AS Pronostics_Indice' .
                  '					    FROM		  pronostics_buteurs' .
                  '					    JOIN		  matches' .
                  '					    			    ON		pronostics_buteurs.Matches_Match = matches.Match' .
                  '					    JOIN		  (	SELECT		@indicePronostics := 0, @match := NULL, @joueur := NULL, @equipe := NULL	) r' .
                  '					    JOIN		  matches_participants' .
                  '					    		    	ON		matches.Match = matches_participants.Matches_Match' .
                  '					    					      AND		pronostics_buteurs.Joueurs_Joueur = matches_participants.Joueurs_Joueur' .
                  '					    WHERE		  pronostics_buteurs.Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                  '					    ORDER BY	pronostics_buteurs.Matches_Match, pronostics_buteurs.Joueurs_Joueur, pronostics_buteurs.Equipes_Equipe' .
                  '				    ) pronostics_buteurs' .
                  '	JOIN		(' .
                  '					    SELECT		Matches_Match' .
                  '								        ,Joueurs_Joueur' .
                  '								        ,Equipes_Equipe' .
                  '								        ,CASE' .
                  '									        WHEN	@match = Matches_Match' .
                  '								      	  	    AND		@joueur = Joueurs_Joueur' .
                  '									        		  AND		@equipe = Equipes_Equipe' .
                  '									        THEN	@indiceMatches := @indiceMatches + 1' .
                  '									        ELSE	(@indiceMatches := 1) AND (@match := Matches_Match) AND (@joueur := Joueurs_Joueur) AND (@equipe := Equipes_Equipe)' .
                  '								        END AS Matches_Indice' .
                  '					    FROM		      matches_buteurs' .
                  '					    JOIN		      matches' .
                  '				    				        ON		matches_buteurs.Matches_Match = matches.Match' .
                  '				    	JOIN		      (	SELECT		@indiceMatches := 0, @joueur := NULL, @equipe := NULL	) r' .
                  '		    			WHERE		      matches_buteurs.Buteurs_CSC = 0' .
                  '		    			ORDER BY	    Matches_Match, Joueurs_Joueur, Equipes_Equipe' .
                  '		    		) matches_buteurs' .
                  '				    ON		pronostics_buteurs.Matches_Match = matches_buteurs.Matches_Match' .
                  '						      AND		pronostics_buteurs.Joueurs_Joueur = matches_buteurs.Joueurs_Joueur' .
                  '						      AND		pronostics_buteurs.Equipes_Equipe = matches_buteurs.Equipes_Equipe' .
                  '						      AND		pronostics_buteurs.Pronostics_Indice = matches_buteurs.Matches_Indice' .
                  '	JOIN		  matches' .
                  '				    ON		pronostics_buteurs.Matches_Match = matches.Match' .
                  '	JOIN		  journees' .
                  '				    ON		matches.Journees_Journee = journees.Journee' .
                  '	WHERE		  journees.Championnats_Championnat = ' . $championship["Championnat"];
				$query = $db->query($sql);
				$foundGoals = $query->fetchAll();
				$countFoundGoals = $foundGoals[0]["Nombre_Buteurs_Trouves"];
				
				// Répartition des points marqués pour un match
				$sql =		'	SELECT		fn_calculpointsmatch	(	IFNULL(matches.Matches_ScoreAPEquipeDomicile, matches.Matches_ScoreEquipeDomicile),' .
                  '											IFNULL(matches.Matches_ScoreAPEquipeVisiteur, matches.Matches_ScoreEquipeVisiteur),' .
                  '											IFNULL(pronostics.Pronostics_ScoreAPEquipeDomicile, pronostics.Pronostics_ScoreEquipeDomicile),' .
                  '											IFNULL(pronostics.Pronostics_ScoreAPEquipeVisiteur, pronostics.Pronostics_ScoreEquipeVisiteur)' .
                  '										) AS ScoreMatch' .
                  '				    ,COUNT(*) AS Nombre' .
                  '	FROM		  pronostics' .
                  '	JOIN		  matches' .
                  '				    ON		pronostics.Matches_Match = matches.Match' .
                  '	JOIN		  journees' .
                  '				    ON		matches.Journees_Journee = journees.Journee' .
                  '	WHERE		  journees.Championnats_Championnat = ' . $championship["Championnat"] .
                  '				    AND		pronostics.Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                  '				    AND		pronostics.Pronostics_ScoreEquipeDomicile IS NOT NULL' .
                  '				    AND		pronostics.Pronostics_ScoreEquipeVisiteur IS NOT NULL' .
                  '				    AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
                  '				    AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
                  '	GROUP BY	fn_calculpointsmatch	(	IFNULL(matches.Matches_ScoreAPEquipeDomicile, matches.Matches_ScoreEquipeDomicile),' .
                  '											IFNULL(matches.Matches_ScoreAPEquipeVisiteur, matches.Matches_ScoreEquipeVisiteur),' .
                  '											IFNULL(pronostics.Pronostics_ScoreAPEquipeDomicile, pronostics.Pronostics_ScoreEquipeDomicile),' .
                  '											IFNULL(pronostics.Pronostics_ScoreAPEquipeVisiteur, pronostics.Pronostics_ScoreEquipeVisiteur)' .
                  '						)' .
                  '	ORDER BY	ScoreMatch DESC';
				$query = $db->query($sql);
				
				$points10 = $points8 = $points7 = $points6 = $points5 = $points3 = $points2 = $points1 = $points0 = 0;
				if($query != null) {
					$pointsScored = $query->fetchAll();
					foreach($pointsScored as $pointScored) {
						switch($pointScored["ScoreMatch"]) {
							case 10: $points10 = $pointScored["Nombre"]; break;
							case 8: $points8 = $pointScored["Nombre"]; break;
							case 7: $points7 = $pointScored["Nombre"]; break;
							case 6: $points6 = $pointScored["Nombre"]; break;
							case 5: $points5 = $pointScored["Nombre"]; break;
							case 3: $points3 = $pointScored["Nombre"]; break;
							case 2: $points2 = $pointScored["Nombre"]; break;
							case 1: $points1 = $pointScored["Nombre"]; break;
							case 0: $points0 = $pointScored["Nombre"]; break;
						}
					}
				}
				
				// Nombre de pronostics oubliés
				$sql =		'	SELECT		COUNT(*) AS Nombre_Oublis' .
                  '	FROM		  matches' .
                  '	JOIN		  journees' .
                  '				    ON		matches.Journees_Journee = journees.Journee' .
                  '	JOIN		  pronostiqueurs' .
                  '				    ON		matches.Matches_Date >= pronostiqueurs.Pronostiqueurs_DateDebutPresence' .
                  '						      AND		(pronostiqueurs.Pronostiqueurs_DateFinPresence IS NULL OR matches.Matches_Date <= pronostiqueurs.Pronostiqueurs_DateFinPresence)' .
                  '	LEFT JOIN	pronostics' .
                  '				    ON		matches.Match = pronostics.Matches_Match' .
                  '						      AND		pronostiqueurs.Pronostiqueur = pronostics.Pronostiqueurs_Pronostiqueur' .
                  '	WHERE		  journees.Championnats_Championnat = ' . $championship["Championnat"] .
                  '	    			AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
                  '	    			AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
                  '	    			AND		pronostics.Pronostics_ScoreEquipeDomicile IS NULL' .
                  '	    			AND		pronostics.Pronostics_ScoreEquipeVisiteur IS NULL' .
                  '	    			AND		pronostiqueurs.Pronostiqueur = ' . $viewedForecaster;
				$query = $db->query($sql);
				$forgottenForecasts = $query->fetchAll();
				$countForgottenForecasts = $forgottenForecasts[0]["Nombre_Oublis"];
				
        // Ajout du championnat dans le résultat
        $championshipStats = array( "Championnats_Nom" => $championship["Championnats_Nom"]
                                    ,"Pronostics_Buteur" => $countForecastsGoal
                                    ,"Buteurs_Trouves" => $countFoundGoals
                                    ,"Points10" => $points10
                                    ,"Points8" => $points8
                                    ,"Points7" => $points7
                                    ,"Points6" => $points6
                                    ,"Points5" => $points5
                                    ,"Points3" => $points3
                                    ,"Points2" => $points2
                                    ,"Points1" => $points1
                                    ,"Points0" => $points0
                                    ,"Oublis" => $countForgottenForecasts);
        array_push($forecasterStats, $championshipStats);
  }

  echo json_encode($forecasterStats);
?>






