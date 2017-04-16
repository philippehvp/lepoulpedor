<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $viewedForecaster = $postedData["pronostiqueur"];

  $sql =		'	SELECT		Championnat, Championnats_Nom' .
            '	FROM		  inscriptions' .
            '	JOIN		  championnats' .
            '				    ON		inscriptions.Championnats_Championnat = championnats.Championnat' .
            '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
            '				    AND		Championnats_Championnat NOT IN (4, 5)' .
            '	ORDER BY	Championnats_Championnat';
  $query = $db->query($sql);
  $championships = $query->fetchAll();

  $forecasterAwards = array();

  // Parcours des championnats du pronostiqueur
  foreach($championships as $championship) {
      $countPoulpeOr = $countPoulpeArgent = $countPoulpeBronze = $countSoulierOr = $countBrandao = $countDjaDjedje = $countRecordPoints = $countRecordPointsButeur = "-";
      $weeksPoulpeOr = $weeksPoulpeArgent = $weeksPoulpeBronze = $weeksSoulierOr = $weeksBrandao = $weeksDjaDjedje = $weeksRecordPoints = $weeksRecordPointsButeur = "-";

      // Journées de poulpe d'or
      $sql =		'	SELECT		GROUP_CONCAT(IFNULL(Journees_NomCourt, Journees_Journee) SEPARATOR \', \') AS Journees_Journees, COUNT(*) AS Nombre_Journees' .
                '	FROM		  trophees' .
                '	JOIN		  journees' .
                '				    ON		trophees.Journees_Journee = journees.Journee' .
                '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
                '				    AND		Trophees_CodeTrophee = 1' .
                '	GROUP BY	Trophees_CodeTrophee';
      $query = $db->query($sql);
      $awardsPoulpeOr = $query->fetchAll();
      if(sizeof($awardsPoulpeOr) > 0) {
        $countPoulpeOr = $awardsPoulpeOr[0]["Nombre_Journees"];
        $weeksPoulpeOr = $awardsPoulpeOr[0]["Journees_Journees"];
      }

      // Journées de poulpe d'argent
      $sql =		'	SELECT		GROUP_CONCAT(IFNULL(Journees_NomCourt, Journees_Journee) SEPARATOR \', \') AS Journees_Journees, COUNT(*) AS Nombre_Journees' .
              '	FROM		trophees' .
              '	JOIN		journees' .
              '				ON		trophees.Journees_Journee = journees.Journee' .
              '	WHERE		Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
              '				AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
              '				AND		Trophees_CodeTrophee = 2' .
              '	GROUP BY	Trophees_CodeTrophee';
      $query = $db->query($sql);
      $awardsPoulpeArgent = $query->fetchAll();
      if(sizeof($awardsPoulpeArgent) > 0) {
        $countPoulpeArgent = $awardsPoulpeArgent[0]["Nombre_Journees"];
        $weeksPoulpeArgent = $awardsPoulpeArgent[0]["Journees_Journees"];
      }

      // Journées de poulpe de bronze
      $sql =		'	SELECT		GROUP_CONCAT(IFNULL(Journees_NomCourt, Journees_Journee) SEPARATOR \', \') AS Journees_Journees, COUNT(*) AS Nombre_Journees' .
                '	FROM		  trophees' .
                '	JOIN		  journees' .
                '				    ON		trophees.Journees_Journee = journees.Journee' .
                '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
                '				    AND		Trophees_CodeTrophee = 3' .
                '	GROUP BY	Trophees_CodeTrophee';
      $query = $db->query($sql);
      $awardsPoulpeBronze = $query->fetchAll();
      if(sizeof($awardsPoulpeBronze) > 0) {
        $countPoulpeBronze = $awardsPoulpeBronze[0]["Nombre_Journees"];
        $weeksPoulpeBronze = $awardsPoulpeBronze[0]["Journees_Journees"];
      }

      // Journées soulier d'or
      $sql =		'	SELECT		GROUP_CONCAT(IFNULL(Journees_NomCourt, Journees_Journee) SEPARATOR \', \') AS Journees_Journees, COUNT(*) AS Nombre_Journees' .
                '	FROM		  trophees' .
                '	JOIN		  journees' .
                '				    ON		trophees.Journees_Journee = journees.Journee' .
                '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
                '				    AND		Trophees_CodeTrophee = 4' .
                '	GROUP BY	Trophees_CodeTrophee';
      $query = $db->query($sql);
      $awardsSoulierOr = $query->fetchAll();
      if(sizeof($awardsSoulierOr) > 0) {
        $countSoulierOr = $awardsSoulierOr[0]["Nombre_Journees"];
        $weeksSoulierOr = $awardsSoulierOr[0]["Journees_Journees"];
      }

      // Journées Brandao
      $sql =		'	SELECT		GROUP_CONCAT(IFNULL(Journees_NomCourt, Journees_Journee) SEPARATOR \', \') AS Journees_Journees, COUNT(*) AS Nombre_Journees' .
                '	FROM		  trophees' .
                '	JOIN		  journees' .
                '				    ON		trophees.Journees_Journee = journees.Journee' .
                '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
                '				    AND		Trophees_CodeTrophee = 5' .
                '	GROUP BY	Trophees_CodeTrophee';
      $query = $db->query($sql);
      $awardsBrandao = $query->fetchAll();
      if(sizeof($awardsBrandao) > 0) {
        $countBrandao = $awardsBrandao[0]["Nombre_Journees"];
        $weeksBrandao = $awardsBrandao[0]["Journees_Journees"];
      }

      // Journées Dja Djédjé
      $sql =		'	SELECT		GROUP_CONCAT(IFNULL(Journees_NomCourt, Journees_Journee) SEPARATOR \', \') AS Journees_Journees, COUNT(*) AS Nombre_Journees' .
                '	FROM		  trophees' .
                '	JOIN		  journees' .
                '				    ON		trophees.Journees_Journee = journees.Journee' .
                '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
                '				    AND		Trophees_CodeTrophee = 6' .
                '	GROUP BY	Trophees_CodeTrophee';
      $query = $db->query($sql);
      $awardsDjaDjedje = $query->fetchAll();
      if(sizeof($awardsDjaDjedje) > 0) {
        $countDjaDjedje = $awardsDjaDjedje[0]["Nombre_Journees"];
        $weeksDjaDjedje = $awardsDjaDjedje[0]["Journees_Journees"];
      }

      // Journées record de points
      $sql =		'	SELECT		GROUP_CONCAT(IFNULL(Journees_NomCourt, Journees_Journee) SEPARATOR \', \') AS Journees_Journees, COUNT(*) AS Nombre_Journees' .
                '	FROM		  trophees' .
                '	JOIN		  journees' .
                '				    ON		trophees.Journees_Journee = journees.Journee' .
                '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
                '				    AND		Trophees_CodeTrophee = 7' .
                '	GROUP BY	Trophees_CodeTrophee';
      $query = $db->query($sql);
      $awardsRecordPoints = $query->fetchAll();
      if(sizeof($awardsRecordPoints) > 0) {
        $countRecordPoints = $awardsRecordPoints[0]["Nombre_Journees"];
        $weeksRecordPoints = $awardsRecordPoints[0]["Journees_Journees"];
      }

      // Journées record de points buteur
      $sql =		'	SELECT		GROUP_CONCAT(IFNULL(Journees_NomCourt, Journees_Journee) SEPARATOR \', \') AS Journees_Journees, COUNT(*) AS Nombre_Journees' .
                '	FROM		  trophees' .
                '	JOIN		  journees' .
                '				    ON		trophees.Journees_Journee = journees.Journee' .
                '	WHERE		  Pronostiqueurs_Pronostiqueur = ' . $viewedForecaster .
                '				    AND		journees.Championnats_Championnat = ' . $championship["Championnat"] .
                '				    AND		Trophees_CodeTrophee = 8' .
                '	GROUP BY	Trophees_CodeTrophee';
      $query = $db->query($sql);
      $awardsRecordPointsButeur = $query->fetchAll();
      if(sizeof($awardsRecordPointsButeur) > 0) {
        $countRecordPointsButeur = $awardsRecordPointsButeur[0]["Nombre_Journees"];
        $weeksRecordPointsButeur = $awardsRecordPointsButeur[0]["Journees_Journees"];
      }

      // Ajout du championnat dans le résultat
      $awardDetailPoulpeOr = array("Nombre_Journees" => $countPoulpeOr, "Journees_Journee" => $weeksPoulpeOr);
      $awardDetailPoulpeArgent = array("Nombre_Journees" => $countPoulpeArgent, "Journees_Journee" => $weeksPoulpeArgent);
      $awardDetailPoulpeBronze = array("Nombre_Journees" => $countPoulpeBronze, "Journees_Journee" => $weeksPoulpeBronze);
      $awardDetailSoulierOr = array("Nombre_Journees" => $countSoulierOr, "Journees_Journee" => $weeksSoulierOr);
      $awardDetailBrandao = array("Nombre_Journees" => $countBrandao, "Journees_Journee" => $weeksBrandao);
      $awardDetailDjaDjedje = array("Nombre_Journees" => $countDjaDjedje, "Journees_Journee" => $weeksDjaDjedje);
      $awardDetailRecordPoints = array("Nombre_Journees" => $countRecordPoints, "Journees_Journee" => $weeksRecordPoints);
      $awardDetailRecordPointsButeur = array("Nombre_Journees" => $countRecordPointsButeur, "Journees_Journee" => $weeksRecordPointsButeur);
      $championshipAwards = array("Championnats_Nom" => $championship["Championnats_Nom"]
                                  ,"PoulpeOr" => $awardDetailPoulpeOr
                                  ,"PoulpeArgent" => $awardDetailPoulpeArgent
                                  ,"PoulpeBronze" => $awardDetailPoulpeBronze
                                  ,"SoulierOr" => $awardDetailSoulierOr
                                  ,"Brandao" => $awardDetailBrandao
                                  ,"DjaDjedje" => $awardDetailDjaDjedje
                                  ,"RecordPoints" => $awardDetailRecordPoints
                                  ,"RecordPointsButeur" => $awardDetailRecordPointsButeur);
      array_push($forecasterAwards, $championshipAwards);
  }

  echo json_encode($forecasterAwards);
?>