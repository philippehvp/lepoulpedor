<?php
  include_once('common.php');

  function checkScoreFaceOff($forecastActionCode, $firstMatchDate, $secondMatchDate) {
    $now = new DateTime();

    // Si la modification concerne un changement de score et que la date du match aller est passée alors aucune mise à jour n'est possible
    // Si la modification concerne un buteur (ajout ou suppression) du match aller et qui est passé alors aucune mise à jour n'est possible
    // Si la modification concerne un buteur (ajout ou suppression) du match retour et qui est passé alors aucune mise à jour n'est possible
    if(
      (($forecastActionCode >= 0 && $forecastActionCode <= 6) && new DateTime($firstMatchDate) < $now) ||
      (($forecastActionCode >= 7 && $forecastActionCode <= 10) && DateTime($firstMatchDate) < $now) ||
      (($forecastActionCode >= 11 && $forecastActionCode <= 14) && DateTime($secondMatchDate) < $now)
    ) {
      return false;
    }

    return true;
  }

  function checkScorerFaceOff($matchDate) {
    $now = new DateTime();
    if(new DateTime($matchDate) < $now)
      return false;

    return true;
  }

  function updateScoreFaceOff($db, $firstMatch, $secondMatch, $forecaster) {
    // La mise à jour d'un seul score d'une confrontation directe implique tout de même de mettre à jour tous les scores
    // En effet, un changement dans le score du match aller peut avoir une incidence sur les scores AP du match retour et des TAB
    // Le fait de recopier tous les scores transmis à la fonction permet de s'assurer de la cohérence des pronostics

    // Match aller
    $sql =    '   UPDATE      pronostics' .
              '   SET         pronostics.Pronostics_ScoreEquipeDomicile = ' . (isset($firstMatch["Pronostics_ScoreEquipeDomicile"]) ? $firstMatch["Pronostics_ScoreEquipeDomicile"] : "NULL") .
              '               , pronostics.Pronostics_ScoreEquipeVisiteur = ' . (isset($firstMatch["Pronostics_ScoreEquipeVisiteur"]) ? $firstMatch["Pronostics_ScoreEquipeVisiteur"] : "NULL") .
              '   WHERE       pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '               AND     pronostics.Matches_Match = ' . $firstMatch["Match"];
    $db->exec($sql);

    // Match retour
    $sql =    '   UPDATE      pronostics' .
              '   SET         pronostics.Pronostics_ScoreEquipeDomicile = ' . (isset($secondMatch["Pronostics_ScoreEquipeDomicile"]) ? $secondMatch["Pronostics_ScoreEquipeDomicile"] : "NULL") .
              '               , pronostics.Pronostics_ScoreEquipeVisiteur = ' . (isset($secondMatch["Pronostics_ScoreEquipeVisiteur"]) ? $secondMatch["Pronostics_ScoreEquipeVisiteur"] : "NULL") .
              '               , pronostics.Pronostics_ScoreAPEquipeDomicile = ' . (isset($secondMatch["Pronostics_ScoreAPEquipeDomicile"]) ? $secondMatch["Pronostics_ScoreAPEquipeDomicile"] : "NULL") .
              '               , pronostics.Pronostics_ScoreAPEquipeVisiteur = ' . (isset($secondMatch["Pronostics_ScoreAPEquipeVisiteur"]) ? $secondMatch["Pronostics_ScoreAPEquipeVisiteur"] : "NULL") .
              '               , pronostics.Pronostics_Vainqueur = ' . $secondMatch["Pronostics_Vainqueur"] .
              '   WHERE       pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '               AND     pronostics.Matches_Match = ' . $secondMatch["Match"];
    $db->exec($sql);
  }

  function addScorer($db, $match, $teamAOrB, $player, $forecaster) {
    if($teamAOrB == 0)
      $sql =    '   INSERT INTO   pronostics_buteurs(Pronostiqueurs_Pronostiqueur, Matches_Match, Joueurs_Joueur, Equipes_Equipe)' .
                '   SELECT        ' . $forecaster . ', ' . $match . ', ' . $player . ', matches.Equipes_EquipeDomicile' .
                '   FROM          matches' .
                '   WHERE         matches.Match = ' . $match;
    else
      $sql =    '   INSERT INTO   pronostics_buteurs(Pronostiqueurs_Pronostiqueur, Matches_Match, Joueurs_Joueur, Equipes_Equipe)' .
                '   SELECT        ' . $forecaster . ', ' . $match . ', ' . $player . ', matches.Equipes_EquipeVisiteur' .
                '   FROM          matches' .
                '   WHERE         matches.Match = ' . $match;
    $db->exec($sql);
  }

  function removeScorer($db, $match, $teamAOrB, $player, $forecaster) {
    $sql =    '   DELETE FROM   pronostics_buteurs' .
              '   WHERE         pronostics_buteurs.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '                 AND   pronostics_buteurs.Matches_Match = ' . $match .
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
  // - 0 et 1 : respectivement score 90 aller domicile et visiteur
  // - 2 et 3 : respectivement score 90 retour domicile et visiteur
  // - 4 et 5 : respectivement score AP retour domicile et visiteur
  // - 6 : vainqueur des TAB (équipe domicile ou visiteur)
  // - 7 et 8 : respectivement ajout d'un buteur aller domicile et visiteur
  // - 9 et 10 : respectivement suppression d'un buteur aller domicile et visiteur
  // - 11 et 12 : respectivement ajout d'un buteur retour domicile et visiteur
  // - 13 et 14 : respectivement suppression d'un buteur retour domicile et visiteur
  // Dans les confrontations directes, il est possible qu'il faille tout mettre à jour car un changement de score
  // peut avoir une incidence sur tout le reste
  // Par exemple, le fait de changer le score du match aller peut signifier que des TAB n'aient plus lieu
  // Donc, il faut toujours tout écrire lorsqu'un changement de score a lieu (c'est le seul moyen dans cet exemple d'effacer les TAB)

  $forecastActionCode = $_GET["forecastActionCode"];

  if($forecastActionCode >= 0 && $forecastActionCode <= 6) {
    // Mise à jour du score
    $firstMatch = $postedData["aller"];
    $secondMatch = $postedData["retour"];
    $firstMatchDate = $firstMatch["Matches_Date"];
    $secondMatchDate = $secondMatch["Matches_Date"];
    $update = checkScoreFaceOff($forecastActionCode, $firstMatchDate, $secondMatchDate);
  }
  else if($forecastActionCode >= 7 && $forecastActionCode <= 14) {
    // Ajout ou suppression d'un pronostic de buteur
    $player = json_decode($postedData["joueur"]);
    $match = json_decode($postedData["match"]);
    $matchDate = json_decode($postedData["date"]);
    $update = checkScorerFaceOff($matchDate);
  }

  $update = true;

  if($update == true) {
    // Mise à jour autorisée
    switch($forecastActionCode) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6: updateScoreFaceOff($db, $firstMatch, $secondMatch, $forecaster); break;
      case 7: addScorer($db, $match, 0, $player, $forecaster); break;
      case 8: addScorer($db, $match, 1, $player, $forecaster); break;
      case 9: removeScorer($db, $match, 0, $player, $forecaster); break;
      case 10: removeScorer($db, $match, 1, $player, $forecaster); break;
      case 11: addScorer($db, $match, 0, $player, $forecaster); break;
      case 12: addScorer($db, $match, 1, $player, $forecaster); break;
      case 13: removeScorer($db, $match, 0, $player, $forecaster); break;
      case 14: removeScorer($db, $match, 1, $player, $forecaster); break;
    }
  }
?>
