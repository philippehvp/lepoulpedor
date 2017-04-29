<?php
  include_once('common.php');

  function checkDateSingle($singleMatchDate) {
    $now = new DateTime();

    // Si la date du match est passée alors aucune mise à jour n'est possible
    if(new DateTime($singleMatchDate) < $now) {
      return false;
    }

    return true;
  }

  function updateScoreSingle($db, $singleMatch, $forecaster) {
    // La mise à jour d'un seul score implique tout de même de mettre à jour tous les scores
    // En effet, un changement dans le score 90 du match peut avoir une incidence sur les scores AP et des TAB
    // Le fait de recopier tous les scores transmis à la fonction permet de s'assurer de la cohérence des pronostics

    // Match
    $sql =    '   UPDATE      pronostics' .
              '   SET         pronostics.Pronostics_ScoreEquipeDomicile = ' . (isset($singleMatch["Pronostics_ScoreEquipeDomicile"]) ? $singleMatch["Pronostics_ScoreEquipeDomicile"] : "NULL") .
              '               , pronostics.Pronostics_ScoreEquipeVisiteur = ' . (isset($singleMatch["Pronostics_ScoreEquipeVisiteur"]) ? $singleMatch["Pronostics_ScoreEquipeVisiteur"] : "NULL") .
              '               , pronostics.Pronostics_ScoreAPEquipeDomicile = ' . (isset($singleMatch["Pronostics_ScoreAPEquipeDomicile"]) ? $singleMatch["Pronostics_ScoreAPEquipeDomicile"] : "NULL") .
              '               , pronostics.Pronostics_ScoreAPEquipeVisiteur = ' . (isset($singleMatch["Pronostics_ScoreAPEquipeVisiteur"]) ? $singleMatch["Pronostics_ScoreAPEquipeVisiteur"] : "NULL") .
              '               , pronostics.Pronostics_Vainqueur = ' . $singleMatch["Pronostics_Vainqueur"] .
              '   WHERE       pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '               AND     pronostics.Matches_Match = ' . $singleMatch["Match"];
    $db->exec($sql);
  }

  function addScorer($db, $singleMatch, $teamAOrB, $player, $forecaster) {
    if($teamAOrB == 0)
      $sql =    '   INSERT INTO   pronostics_buteurs(Pronostiqueurs_Pronostiqueur, Matches_Match, Joueurs_Joueur, Equipes_Equipe)' .
                '   SELECT        ' . $forecaster . ', ' . $singleMatch . ', ' . $player . ', matches.Equipes_EquipeDomicile' .
                '   FROM          matches' .
                '   WHERE         matches.Match = ' . $singleMatch;
    else
      $sql =    '   INSERT INTO   pronostics_buteurs(Pronostiqueurs_Pronostiqueur, Matches_Match, Joueurs_Joueur, Equipes_Equipe)' .
                '   SELECT        ' . $forecaster . ', ' . $singleMatch . ', ' . $player . ', matches.Equipes_EquipeVisiteur' .
                '   FROM          matches' .
                '   WHERE         matches.Match = ' . $singleMatch;
    $db->exec($sql);
  }

  function removeScorer($db, $singleMatch, $teamAOrB, $player, $forecaster) {
    $sql =    '   DELETE FROM   pronostics_buteurs' .
              '   WHERE         pronostics_buteurs.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '                 AND   pronostics_buteurs.Matches_Match = ' . $singleMatch .
              '                 AND   pronostics_buteurs.Joueurs_Joueur = ' . $player .
              '   ORDER BY      pronostics_buteurs.Pronostiqueurs_Pronostiqueur, pronostics_buteurs.Matches_Match, pronostics_buteurs.Joueurs_Joueur' .
              '   LIMIT         1';
    $db->exec($sql);
  }

  // Selon le type d'action, les données transmises ne sont pas les mêmes
  $forecaster = isset($_SESSION["pronostiqueur"]) ? $_SESSION["pronostiqueur"] : 0;
  $postedData = json_decode(file_get_contents("php://input"), true);
  $forecaster = json_decode($postedData["pronostiqueur"]);

  // Le code action permet de savoir quelle est la nature de la modification :
  // - 0 et 1 : respectivement score 90 domicile et visiteur
  // - 2 et 3 : respectivement score AP domicile et visiteur
  // - 4 : vainqueur des TAB (équipe domicile ou visiteur)
  // - 5 et 6 : respectivement ajout d'un buteur domicile et visiteur
  // - 7 et 8 : respectivement suppression d'un buteur domicile et visiteur

  $forecastActionCode = $_GET["forecastActionCode"];

  if($forecastActionCode >= 0 && $forecastActionCode <= 4) {
    $singleMatch = $postedData["match"];
    $singleMatchDate = $singleMatch["Matches_Date"];
  }
  else if($forecastActionCode >= 5 && $forecastActionCode <= 8) {
    // Ajout ou suppression d'un pronostic de buteur
    $player = json_decode($postedData["joueur"]);
    $singleMatch = json_decode($postedData["match"]);
    $singleMatchDate = json_decode($postedData["date"]);
  }

  $update = checkDateSingle($singleMatchDate);

  if($update) {
    // Mise à jour autorisée
    switch($forecastActionCode) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4: updateScoreSingle($db, $singleMatch, $forecaster); break;
      case 5: addScorer($db, $singleMatch, 0, $player, $forecaster); break;
      case 6: addScorer($db, $singleMatch, 1, $player, $forecaster); break;
      case 7: removeScorer($db, $singleMatch, 0, $player, $forecaster); break;
      case 8: removeScorer($db, $singleMatch, 1, $player, $forecaster); break;
    }
  }
?>
