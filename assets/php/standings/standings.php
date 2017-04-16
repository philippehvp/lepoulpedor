<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championnat = json_decode($postedData["championnat"]);
  $journee = json_decode($postedData["journee"]);
  $dateReference = $postedData["date-reference"];

  $sql =    '   SELECT    pronostiqueurs.Pronostiqueur' .
            '             ,pronostiqueurs.Pronostiqueurs_NomUtilisateur' .
            '             ,pronostiqueurs.Pronostiqueurs_Photo' .
            '             ,classements.Classements_ClassementGeneralMatch' .
            '             ,classements.Classements_PointsGeneralMatch' .
            '             ,classements.Classements_PointsGeneralButeur' .
            '				      ,CASE' .
						'					      WHEN	classements_veille.Pronostiqueurs_Pronostiqueur IS NOT NULL' .
						'					      THEN	classements_veille.Classements_ClassementGeneralMatch - classements.Classements_ClassementGeneralMatch' .
						'					      ELSE	-1000' .
						'				      END AS Classement_Evolution' .
            '   FROM      classements' .
            '   JOIN      (' .
            '               SELECT    Pronostiqueur, Pronostiqueurs_NomUtilisateur, Pronostiqueurs_Photo' .
            '               FROM      pronostiqueurs' .
            '               UNION ALL' .
            '               SELECT    Pronostiqueur, Pronostiqueurs_NomUtilisateur, NULL AS Pronostiqueurs_Photo' .
            '               FROM      pronostiqueurs_anciens' .
            '             ) pronostiqueurs' .
            '             ON    classements.Pronostiqueurs_Pronostiqueur = pronostiqueurs.Pronostiqueur' .
						'	  LEFT JOIN	(' .
						'					      SELECT		classements.Pronostiqueurs_Pronostiqueur, classements.Journees_Journee, classements.Classements_ClassementGeneralMatch, classements.Classements_PointsGeneralMatch' .
						'					      FROM		  classements' .
						'      					JOIN		  (' .
						'      									    SELECT		MAX(classements.Journees_Journee) AS Journee, journees.Classements_DateReference' .
						'      									    FROM		  classements' .
						'      									    JOIN		  (' .
						'	             					  							SELECT		MAX(classements.Classements_DateReference) AS Classements_DateReference' .
						'      				      			  						FROM		  classements' .
						'           								  					JOIN		  journees' .
						'      		        						  								  ON		classements.Journees_Journee = journees.Journee' .
						'      		      								  			WHERE		  classements.Classements_DateReference < ' . $db->quote($dateReference) .
						'      					        					  						  AND		journees.Championnats_Championnat = ' . $championnat .
						'      					      						  	) journees' .
						'      								      				  ON		classements.Classements_DateReference = journees.Classements_DateReference' .
						'      									    GROUP BY	  journees.Classements_DateReference' .
            '                           LIMIT     1' .
						'      								    ) journees' .
						'      								    ON		classements.Journees_Journee = journees.Journee' .
						'      										      AND		classements.Classements_DateReference = journees.Classements_DateReference' .
						'      				) classements_veille' .
						'      				ON		classements.Pronostiqueurs_Pronostiqueur = classements_veille.Pronostiqueurs_Pronostiqueur' .
            '   WHERE     classements.Journees_Journee = ' . $journee .
            '             AND   classements.Classements_DateReference = ' . $db->quote($dateReference) .
            '             AND   classements.Classements_ClassementGeneralMatch IS NOT NULL' .
            '   ORDER BY  classements.Classements_ClassementGeneralMatch';
  $query = $db->query($sql);
  $standings = $query->fetchAll();

  echo json_encode($standings);

?>