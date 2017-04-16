<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $saison = json_decode($postedData["saison"]);
  $championnat = json_decode($postedData["championnat"]);

  $sql =    '   SELECT    DISTINCT Journees_Journee AS Journee, classements.Classements_DateReference, Journees_NomCourt, IFNULL(UNIX_TIMESTAMP(journees.Journees_DateMAJ) * 1000, \'\') AS Journees_DateMAJ' .
            '   FROM      classements' .
            '   JOIN      journees' .
            '             ON    classements.Journees_Journee = journees.Journee' .
            '   WHERE     journees.Championnats_Championnat = ' . $championnat .
            '   ORDER BY  classements.Classements_DateReference DESC';

  $query = $db->query($sql);
  $weeks = $query->fetchAll();

  echo json_encode($weeks);

?>