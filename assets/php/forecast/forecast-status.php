<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $forecaster = json_decode($postedData["pronostiqueur"]);
  $matchNumber = json_decode($postedData["match"]);

  // Lecture du statut du pronostic pour savoir si le pronostic a été correctement saisi ou non, si la date du match est passée ou non, etc.
  $sql =    ' SELECT      CASE' .
            '                 WHEN  matches.Matches_Date < NOW()' .
            '                 THEN  0' .
            '                 WHEN  fn_matchpronostiquable(matches.Match, ' . $forecaster . ') = 0' .
            '                 THEN  1' .
            '                 WHEN  fn_pronosticcorrect(matches.Match, ' . $forecaster . ') = 0' .
            '                 THEN  2' .
            '                 ELSE  3' .
            '             END AS Matches_EtatPronostic' .
            ' FROM        matches' .
            ' JOIN        pronostics' .
            '             ON    matches.Match = pronostics.Matches_Match' .
            ' WHERE       matches.Match = ' . $matchNumber .
            '             AND   pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster;
  $query = $db->query($sql);
  $correctForecast = $query->fetchAll();
  echo json_encode($correctForecast);
?>
