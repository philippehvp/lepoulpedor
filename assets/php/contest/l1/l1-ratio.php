<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];

  $forecaster = isset($forecaster) ? $forecaster : 0;

	// Liste des pronostiqueurs pour le championnat en question
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
	$forecastersCount = sizeof($forecasters);

  // Journées
	$sql =		'	SELECT		scores.Journees_Journee, Scores_Match + Scores_Bonus + Scores_Buteur AS Scores_Match, Scores_Buteur' .
            '	FROM		  (' .
            '				  	  SELECT		Journees_Journee, SUM(Scores_Match) AS Scores_Match, SUM(Scores_Bonus) AS Scores_Bonus' .
            '			  		  FROM		  (' .
            '		  							      SELECT		matches.Journees_Journee' .
            '	  											          ,fn_calculscorematch(' .
            ' 												  	        CASE' .
            '       	  													  WHEN	matches.Matches_MatchCS = 1' .
            '				          									  	THEN	5' .
            '							  	        				  		WHEN	matches.Matches_AvecProlongation = 0 AND IFNULL(matches.Matches_MatchLie, 0) = 0' .
            '								  			          			THEN	1' .
            '       					  					  				WHEN	matches.Matches_AvecProlongation = 0 AND IFNULL(matches.Matches_MatchLie, 0) <> 0' .
            '       						  			  					THEN	2' .
            '       							  	  						WHEN	matches.Matches_AvecProlongation = 1 AND IFNULL(matches.Matches_MatchLie, 0) <> 0' .
            '       							    							THEN	3' .
            '       						  		  						ELSE	4' .
            '       					  				  				END' .
            '				  									          ,matches.Matches_ScoreEquipeDomicile' .
            '			  										          ,matches.Matches_ScoreEquipeVisiteur' .
            '		  											          ,matches.Matches_ScoreAPEquipeDomicile' .
            '	  												          ,matches.Matches_ScoreAPEquipeVisiteur' .
            '  	  												        ,matches.Matches_AvecProlongation' .
            '	  												          ,matches.Matches_Vainqueur' .
            '			  									  	        ,matches.Matches_MatchCS' .
            '				  							  		        ,matches.Matches_MatchLie' .
            '					  					  			        ,matches.Matches_CoteEquipeDomicile' .
            '						  			  				        ,matches.Matches_CoteNul' .
            '							  	  					        ,matches.Matches_CoteEquipeVisiteur' .
            '							    						        ,matches.Matches_Coefficient' .
            '						  		  					        /* Partie normalement réservée aux pronostics */' .
            '					  				  			          ,matches.Matches_ScoreEquipeDomicile' .
            '				  						  			        ,matches.Matches_ScoreEquipeVisiteur' .
            '			  								  		        ,matches.Matches_ScoreAPEquipeDomicile' .
            '		  										  	        ,matches.Matches_ScoreAPEquipeVisiteur' .
            '	  												          ,matches.Matches_Vainqueur' .
            ' 												          ) AS Scores_Match' .
            '												            ,fn_calculscorebonus(' .
            '											  	          	matches.Match' .
            '										  			          ,CASE' .
            '									  					          WHEN	matches.Matches_MatchCS = 1' .
            '								  						          THEN	5' .
            '							  							          WHEN	matches.Matches_AvecProlongation = 0 AND IFNULL(matches.Matches_MatchLie, 0) = 0' .
            '						  								          THEN	1' .
            '					  									          WHEN	matches.Matches_AvecProlongation = 0 AND IFNULL(matches.Matches_MatchLie, 0) <> 0' .
            '				  										          THEN	2' .
            '			  											          WHEN	matches.Matches_AvecProlongation = 1 AND IFNULL(matches.Matches_MatchLie, 0) <> 0' .
            '		  												          THEN	3' .
            '	  													          ELSE	4' .
            ' 													          END' .
            '         													  ,matches.Matches_ScoreEquipeDomicile' .
            '												  	          ,matches.Matches_ScoreEquipeVisiteur' .
            '											  		          ,matches.Matches_ScoreAPEquipeDomicile' .
            '										  			          ,matches.Matches_ScoreAPEquipeVisiteur' .
            '									  				          ,matches.Matches_AvecProlongation' .
            '								  					          ,matches.Matches_Vainqueur' .
            '							  						          ,matches.Matches_MatchCS' .
            '						  							          ,matches.Matches_MatchLie' .
            '					  								          ,matches.Matches_CoteEquipeDomicile' .
            '				  									          ,matches.Matches_CoteNul' .
            '			  										          ,matches.Matches_CoteEquipeVisiteur' .
            '		  											          ,matches.Matches_Coefficient' .
            '	  												          ,matches.Matches_PointsQualificationEquipeDomicile' .
            ' 													          ,matches.Matches_PointsQualificationEquipeVisiteur' .
            '													            ,matches.Matches_FinaleEuropeenne' .
            '												  	          /* Partie normalement réservée aux pronostics */' .
            '											  		          ,matches.Matches_ScoreEquipeDomicile' .
            '										  			          ,matches.Matches_ScoreEquipeVisiteur' .
            '									  				          ,matches.Matches_ScoreAPEquipeDomicile' .
            '								  					          ,matches.Matches_ScoreAPEquipeVisiteur' .
            '							  						          ,matches.Matches_Vainqueur' .
            '						  							          ,MatchesAller.Matches_ScoreEquipeDomicile' .
            '					  								          ,MatchesAller.Matches_ScoreEquipeVisiteur' .
            '				  									          ,MatchesAller.Matches_ScoreEquipeDomicile' .
            '			  										          ,MatchesAller.Matches_ScoreEquipeVisiteur' .
            '		  											          ,0' .
            '	  											        ) AS Scores_Bonus' .
            ' 									FROM		      matches' .
            '									  JOIN		      journees' .
            '								  				        ON		matches.Journees_Journee = journees.Journee' .
            '							  		LEFT JOIN	    matches MatchesAller' .
            '						  						        ON		matches.Matches_MatchLie = MatchesAller.Match' .
            '					  				WHERE		      journees.Championnats_Championnat = ' . $championship .
            '				  								        AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
            '			  									        AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
            '		  						) scores' .
            '	  				GROUP BY	Journees_Journee' .
            ' 				) scores' .
            '	JOIN		(' .
            '					  SELECT		  Journees_Journee, SUM(Scores_Buteur) AS Scores_Buteur' .
            '					  FROM		    (' .
            '						    			    SELECT		Journees_Journee' .
            '						  	  					        ,fn_calculcotebuteur(Buteurs_Cote) * matches.Matches_Coefficient AS Scores_Buteur' .
            '					  			  	    FROM		  matches_buteurs' .
            '				  					      JOIN		  matches' .
            '			  							  		        ON		matches_buteurs.Matches_Match = matches.Match' .
            '		  							      JOIN		  journees' .
            '												            ON		matches.Journees_Journee = journees.Journee' .
            '			  						      WHERE		  Buteurs_CSC = 0' .
            '				  					  			        AND		journees.Championnats_Championnat = ' . $championship .
            '					  			  				        AND		matches.Matches_ScoreEquipeDomicile IS NOT NULL' .
            '						  	  					        AND		matches.Matches_ScoreEquipeVisiteur IS NOT NULL' .
            '							    	    ) scores_buteur' .
            '					    GROUP BY	Journees_Journee' .
            '				    ) scores_buteur' .
            '				    ON		scores.Journees_Journee = scores_buteur.Journees_Journee' .
            '	ORDER BY	scores.Journees_Journee DESC';
	$query = $db->query($sql);
	$theoricScores = $query->fetchAll();
	$weeksCount = sizeof($theoricScores);

	// Scores match et scores buteur pour chaque pronostiqueur
  $sql =    ' SELECT       pronostiqueurs_classements.Classements_PointsJourneeMatch' .
            '              ,pronostiqueurs_classements.Classements_PointsJourneeButeur' .
            '  FROM        (' .
            '                SELECT      classements.Pronostiqueurs_Pronostiqueur, classements.Journees_Journee, classements.Classements_PointsJourneeMatch, classements.Classements_PointsJourneeButeur' .
            '                FROM        classements' .
            '                JOIN        (' .
            '                                SELECT    classements.Pronostiqueurs_Pronostiqueur, classements.Journees_Journee, MAX(classements.Classements_DateReference) AS Classements_DateReference' .
            '                                FROM      classements' .
            '                                JOIN      journees' .
            '                                          ON    classements.Journees_Journee = journees.Journee' .
            '                                WHERE     journees.Championnats_Championnat = ' . $championship .
            '                                GROUP BY  classements.Pronostiqueurs_Pronostiqueur, classements.Journees_Journee' .
            '                            ) classements_max' .
            '                            ON    classements.Pronostiqueurs_Pronostiqueur = classements_max.Pronostiqueurs_Pronostiqueur' .
            '                                  AND   classements.Journees_Journee = classements_max.Journees_Journee' .
            '                                  AND   classements.Classements_DateReference = classements_max.Classements_DateReference' .
            '              ) pronostiqueurs_classements' .
            '  JOIN        pronostiqueurs' .
            '              ON    pronostiqueurs_classements.Pronostiqueurs_Pronostiqueur = pronostiqueurs.Pronostiqueur' .
            '  JOIN        inscriptions' .
            '              ON pronostiqueurs_classements.Pronostiqueurs_Pronostiqueur = inscriptions.Pronostiqueurs_Pronostiqueur' .
            '  JOIN        journees' .
            '              ON    pronostiqueurs_classements.Journees_Journee = journees.Journee' .
            '                    AND   inscriptions.Championnats_Championnat = journees.Championnats_Championnat' .
            '  WHERE       pronostiqueurs_classements.Classements_PointsJourneeMatch IS NOT NULL' .
            '  ORDER  BY   pronostiqueurs.Pronostiqueurs_NomUtilisateur, pronostiqueurs_classements.Journees_Journee DESC';
	$query = $db->query($sql);
	$results = $query->fetchAll();

  $weeks = array();
  foreach($theoricScores as $ts) {
    $week = array("Journees_Journee" => $ts["Journees_Journee"], "Scores_Match" => $ts["Scores_Match"], "Scores_Buteur" => $ts["Scores_Buteur"]);
    array_push($weeks, $week);
  }

  $forecastersResults = array();
  for($i = 0; $i < $forecastersCount; $i++) {
    $forecasterResults = array();
    for($j = 0; $j < $weeksCount; $j++) {
      $weekResults = array(
         "Classements_PointsJourneeMatch" => $results[($i * $weeksCount) + $j]["Classements_PointsJourneeMatch"]
         ,"Ratio_Match" => $results[($i * $weeksCount) + $j]["Classements_PointsJourneeMatch"] / $theoricScores[$j]["Scores_Match"] * 100
         ,"Ratio_Buteur" => $results[($i * $weeksCount) + $j]["Classements_PointsJourneeButeur"] / $theoricScores[$j]["Scores_Buteur"] * 100
      );
      array_push($forecasterResults, $weekResults);
    }
    array_push($forecastersResults, $forecasterResults);
  }

  $ratio = array();
  $ratio['Journees'] = $weeks;
  $ratio['Pronostiqueurs'] = $forecasters;
  $ratio['Donnees'] = $forecastersResults;
  echo json_encode($ratio);

?>