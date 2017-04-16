<?php
  include_once('common.php');
  include_once('l1-common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];

  $forecaster = isset($_SESSION["pronostiqueur"]) ? $_SESSION["pronostiqueur"] : 0;

  $forecasters = readForecasters($db, $forecaster, $championship);
  $forecastersCount = count($forecasters);

	$sql =		'	SELECT		  Nombre_Victoires_Reelles / Nombre_Victoires_Pronostiquees * 100 AS Ratio_Victoires, Nombre_Victoires_Reelles, Nombre_Victoires_Pronostiquees' .
            '				      ,Nombre_Nuls_Reels / Nombre_Nuls_Pronostiques * 100 AS Ratio_Nuls, Nombre_Nuls_Reels, Nombre_Nuls_Pronostiques' .
            '	  			    ,Nombre_Defaites_Reelles / Nombre_Defaites_Pronostiquees * 100 AS Ratio_Defaites, Nombre_Defaites_Reelles, Nombre_Defaites_Pronostiquees' .
            '		  		    ,CASE' .
            '			  	    	WHEN		pronostiqueurs_rivaux.PronostiqueursRivaux_Pronostiqueur IS NOT NULL' .
            '				      	THEN		1' .
            '				      	ELSE		0' .
            '				      END AS Pronostiqueurs_Rival' .
            '	FROM		    (' .
            '				  	    SELECT		pronostics.Pronostiqueurs_Pronostiqueur, SUM(pronostics.Victoires_Pronostiquees) AS Nombre_Victoires_Pronostiquees, SUM(Victoires_Reelles) AS Nombre_Victoires_Reelles' .
            '					      FROM		  (' .
            '									          SELECT		Pronostiqueurs_Pronostiqueur, Matches_Match, 1 AS Victoires_Pronostiquees' .
            '												              ,CASE' .
            '													              WHEN	(	Matches_ScoreEquipeDomicile > Matches_ScoreEquipeVisiteur' .
            '													              			OR		Matches_ScoreAPEquipeDomicile > Matches_ScoreAPEquipeVisiteur' .
            '													              			OR		Matches_Vainqueur = 1' .
            '													              		)' .
            '													              THEN	1' .
            '												  	            ELSE	0' .
            '											  	            END AS Victoires_Reelles' .
            '									          FROM		  pronostics' .
            '									          JOIN		  matches' .
            '								  				            ON		pronostics.Matches_Match = matches.Match' .
            '							  		        JOIN		  journees' .
            '						  						            ON		matches.Journees_Journee = journees.Journee' .
            '					  				        WHERE		  journees.Championnats_Championnat = ' . $championship .
            '												              AND		Pronostics_ScoreEquipeDomicile IS NOT NULL' .
            '												              AND		Pronostics_ScoreEquipeVisiteur IS NOT NULL' .
            '											  	            AND		(	Pronostics_ScoreEquipeDomicile > Pronostics_ScoreEquipeVisiteur' .
            '										  					              OR		Pronostics_ScoreAPEquipeDomicile > Pronostics_ScoreAPEquipeVisiteur' .
            '									  						              OR		Pronostics_Vainqueur = 1' .
            '								  						              )' .
            '							  	        ) pronostics' .
            '					      GROUP BY	pronostics.Pronostiqueurs_Pronostiqueur' .
            '				    ) pronostics_victoire' .
            '	JOIN		  (' .
            '		  			  SELECT		pronostics.Pronostiqueurs_Pronostiqueur, SUM(pronostics.Nuls_Pronostiques) AS Nombre_Nuls_Pronostiques, SUM(Nuls_Reels) AS Nombre_Nuls_Reels' .
            '	  				  FROM		  (' .
            ' 									      SELECT		Pronostiqueurs_Pronostiqueur, Matches_Match, 1 AS Nuls_Pronostiques' .
            '												            ,CASE' .
            '													            WHEN	(	Matches_ScoreEquipeDomicile = Matches_ScoreEquipeVisiteur' .
            '												  				          AND		Matches_ScoreAPEquipeDomicile IS NULL' .
            '											  					          AND		Matches_ScoreAPEquipeVisiteur IS NULL' .
            '										  						          AND		Matches_Vainqueur IS NULL' .
            '									  						          )' .
            '								  					          THEN	1' .
            '							  						          ELSE	0' .
            '						  						          END AS Nuls_Reels' .
            '					  				      FROM		pronostics' .
            '				  					      JOIN		matches' .
            '			  									        ON		pronostics.Matches_Match = matches.Match' .
            '		  							      JOIN		journees' .
            '	  											        ON		matches.Journees_Journee = journees.Journee' .
            ' 									      WHERE		journees.Championnats_Championnat = ' . $championship .
            '												          AND		Pronostics_ScoreEquipeDomicile IS NOT NULL' .
            '												          AND		Pronostics_ScoreEquipeVisiteur IS NOT NULL' .
            '												          AND		(	Pronostics_ScoreEquipeDomicile = Pronostics_ScoreEquipeVisiteur' .
            '											  				          AND		Pronostics_ScoreAPEquipeDomicile IS NULL' .
            '										  					          AND		Pronostics_ScoreAPEquipeVisiteur IS NULL' .
            '									  						          AND		Pronostics_Vainqueur IS NULL' .
            '								  						          )' .
            '							  	      ) pronostics' .
            '					    GROUP BY	  pronostics.Pronostiqueurs_Pronostiqueur' .
            '				    ) pronostics_nul' .
            '				    ON		pronostics_victoire.Pronostiqueurs_Pronostiqueur = pronostics_nul.Pronostiqueurs_Pronostiqueur' .
            '	JOIN		  (' .
            '					    SELECT		pronostics.Pronostiqueurs_Pronostiqueur, SUM(pronostics.Defaites_Pronostiquees) AS Nombre_Defaites_Pronostiquees, SUM(Defaites_Reelles) AS Nombre_Defaites_Reelles' .
            '					    FROM		  (' .
            '					  				      SELECT		Pronostiqueurs_Pronostiqueur, Matches_Match, 1 AS Defaites_Pronostiquees' .
            '					  						            ,CASE' .
            '					  								          WHEN	(	Matches_ScoreEquipeDomicile > Matches_ScoreEquipeVisiteur' .
            '					  											            OR		Matches_ScoreAPEquipeDomicile > Matches_ScoreAPEquipeVisiteur' .
            '					  											            OR		Matches_Vainqueur = 1' .
            '					  										            )' .
            '						  							          THEN	1' .
            '					  								          ELSE	0' .
            '					  							          END AS Defaites_Reelles' .
            '						  			      FROM		pronostics' .
            '						  			      JOIN		matches' .
            '						  						        ON		pronostics.Matches_Match = matches.Match' .
            '						  			      JOIN		journees' .
            '							  					        ON		matches.Journees_Journee = journees.Journee' .
            '							  		      WHERE		journees.Championnats_Championnat = ' . $championship .
            '							  					        AND		Pronostics_ScoreEquipeDomicile IS NOT NULL' .
            '							  					        AND		Pronostics_ScoreEquipeVisiteur IS NOT NULL' .
            '							  					        AND		(	Pronostics_ScoreEquipeDomicile < Pronostics_ScoreEquipeVisiteur' .
            '								  							          OR		Pronostics_ScoreAPEquipeDomicile < Pronostics_ScoreAPEquipeVisiteur' .
            '							  								          OR		Pronostics_Vainqueur = 2' .
            '						  								          )' .
            '						  		      ) pronostics' .
            '					    GROUP BY	  pronostics.Pronostiqueurs_Pronostiqueur' .
            '				    ) pronostics_defaite' .
            '				    ON		pronostics_victoire.Pronostiqueurs_Pronostiqueur = pronostics_defaite.Pronostiqueurs_Pronostiqueur' .
            '	JOIN		  pronostiqueurs' .
            '				    ON		pronostics_victoire.Pronostiqueurs_Pronostiqueur = pronostiqueurs.Pronostiqueur' .
            '	LEFT JOIN	pronostiqueurs_rivaux' .
            '				    ON		pronostiqueurs_rivaux.Pronostiqueur = ' . $forecaster .
            '						      AND		pronostiqueurs.Pronostiqueur = pronostiqueurs_rivaux.PronostiqueursRivaux_Pronostiqueur' .
            '	ORDER BY	pronostiqueurs.Pronostiqueurs_NomUtilisateur';
	$query = $db->query($sql);
	$winDrawLoss = $query->fetchAll();

  $forecastersWDL = array();
  foreach($winDrawLoss as $wdl) {
      $forecasterWDL = array(
        "Nombre_Victoires_Pronostiquees" => $wdl["Nombre_Victoires_Pronostiquees"]
        ,"Nombre_Victoires_Reelles" => $wdl["Nombre_Victoires_Reelles"]
        ,"Ratio_Victoires" => $wdl["Ratio_Victoires"]
        ,"Nombre_Nuls_Pronostiques" => $wdl["Nombre_Nuls_Pronostiques"]
        ,"Nombre_Nuls_Reels" => $wdl["Nombre_Nuls_Reels"]
        ,"Ratio_Nuls" => $wdl["Ratio_Nuls"]
        ,"Nombre_Defaites_Pronostiquees" => $wdl["Nombre_Defaites_Pronostiquees"]
        ,"Nombre_Defaites_Reelles" => $wdl["Nombre_Defaites_Reelles"]
        ,"Ratio_Defaites" => $wdl["Ratio_Defaites"]
      );
      array_push($forecastersWDL, $forecasterWDL);
  }

  $wdl = array();
  $wdl['Pronostiqueurs'] = $forecasters;
  $wdl['Donnees'] = $forecastersWDL;
  echo json_encode($wdl);

?>