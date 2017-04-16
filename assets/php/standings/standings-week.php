<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $journee = json_decode($postedData["journee"]);
  $dateReference = $postedData["date-reference"];

  $sql =      '   SELECT      pronostiqueurs.Pronostiqueur' .
              '               ,pronostiqueurs.Pronostiqueurs_NomUtilisateur' .
              '               ,pronostiqueurs.Pronostiqueurs_Photo' .
              '               ,classements.Classements_ClassementJourneeMatch' .
              '               ,classements.Classements_PointsJourneeMatch' .
              '               ,classements.Classements_PointsJourneeButeur' .
              '   FROM        classements' .
              '   JOIN        (' .
              '                   SELECT      Pronostiqueur, Pronostiqueurs_NomUtilisateur, Pronostiqueurs_Photo' .
              '                   FROM        pronostiqueurs' .
              '                   UNION ALL' .
              '                   SELECT      Pronostiqueur, Pronostiqueurs_NomUtilisateur, NULL AS Pronostiqueurs_Photo' .
              '                   FROM        pronostiqueurs_anciens' .
              '               ) pronostiqueurs' .
              '               ON      classements.Pronostiqueurs_Pronostiqueur = pronostiqueurs.Pronostiqueur' .
              '   WHERE       classements.Journees_Journee = ' . $journee .
              '               AND     classements.Classements_DateReference = ' . $db->quote($dateReference) .
              '               AND     classements.Classements_ClassementJourneeMatch IS NOT NULL' .
              '   ORDER BY    classements.Classements_ClassementJourneeMatch';

  $query = $db->query($sql);
  $standingsWeek = $query->fetchAll();

  echo json_encode($standingsWeek);

?>