<?php
  include_once('common.php');

  function checkNormalMatch($matchesDate) {
    // Aucune modification possible si la date du match est passée
    if($matchesDate > new DateTime()) {
      return false;
    }

    return true;
  }

  function checkSpecialMatch($forecastActionCode, $matchesDate, $matchesDateMax) {
    $now = new DateTime();

    // Aucune modification possible si la date du match est passée
    if(new DateTime($matchesDate) < $now) {
      return false;
    }

    // Si la modification concerne un changement de score et que la date max est passée alors pas de mise à jour
    if(($forecastActionCode >= 0 && $forecastActionCode <= 4) && new DateTime($matchesDateMax) < $now) {
      return false;
    }

    return true;
  }

  function updateScoreA($match, $pronosticsScoreEquipeDomicile) {
    $sql =    '   UPDATE      pronostics' .
              '   SET         pronostics.Pronostics_ScoreEquipeDomicile = ' . $pronosticsScoreEquipeDomicile .
              '   WHERE       pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '               AND     pronostics.Matches_Match = ' . $match;
    $db->exec($sql);
  }

  function updateScoreB($match, $pronosticsScoreEquipeVisiteur) {
    $sql =    '   UPDATE      pronostics' .
              '   SET         pronostics.Pronostics_ScoreEquipeDomicile = ' . $pronosticsScoreEquipeVisiteur .
              '   WHERE       pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '               AND     pronostics.Matches_Match = ' . $match;
    $db->exec($sql);
  }

  function updateScoreExtraA($match, $pronosticsScoreAPEquipeDomicile) {
    $sql =    '   UPDATE      pronostics' .
              '   SET         pronostics.Pronostics_ScoreAPEquipeDomicile = ' . $pronosticsScoreAPEquipeDomicile .
              '   WHERE       pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '               AND     pronostics.Matches_Match = ' . $match;
    $db->exec($sql);
  }

  function updateScoreExtraB($match, $pronosticsScoreAPEquipeVisiteur) {
    $sql =    '   UPDATE      pronostics' .
              '   SET         pronostics.Pronostics_ScoreAPEquipeDomicile = ' . $pronosticsScoreAPEquipeVisiteur .
              '   WHERE       pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '               AND     pronostics.Matches_Match = ' . $match;
    $db->exec($sql);
  }

  function updateShootingWinner($match, $pronosticsVainqueur) {
    $sql =    '   UPDATE      pronostics' .
              '   SET         pronostics.Pronostics_Vainqueur = ' . $pronosticsVainqueur .
              '   WHERE       pronostics.Pronostiqueurs_Pronostiqueur = ' . $forecaster .
              '               AND     pronostics.Matches_Match = ' . $match;
    $db->exec($sql);
  }

  $forecaster = isset($_SESSION["pronostiqueur"]) ? $_SESSION["pronostiqueur"] : 0;
  $postedData = json_decode(file_get_contents("php://input"), true);
  $match = $postedData["Match"];
  $matchesDate = $postedData["Matches_Date"];
  $matchesDateMax = $postedData["Matches_DateMax"];
  $matchesType = $postedData["Matches_TypeMatch"];
  $pronosticsScoreEquipeDomicile = $postedData["Pronostics_ScoreEquipeDomicile"];
  $pronosticsScoreEquipeVisiteur = $postedData["Pronostics_ScoreEquipeVisiteur"];
  $pronosticsScoreAPEquipeDomicile = $postedData["Pronostics_ScoreAPEquipeDomicile"];
  $pronosticsScoreAPEquipeVisiteur = $postedData["Pronostics_ScoreAPEquipeVisiteur"];
  $pronosticsVainqueur = $postedData["Pronostics_Vainqueur"];

  $forecastActionCode = $_GET["forecastActionCode"];

  // Le code action permet de savoir quelle est la nature de la modification :
  // - 0 et 1 : respectivement score 90 domicile et visiteur
  // - 2 et 3 : respectivement score AP domicile et visiteur
  // - 4 : vainqueur des TAB (n'importe lequel)
  // - 5 : ajout d'un buteur
  // - 6 : suppression d'un buteur

  // La date max est différente de la date du match uniquement dans le cas d'une confrontation directe
  // A ce moment-là, la date du match indique la date à laquelle on peut encore pronostiquer les buteurs
  // Et la date max celle à laquelle on peut pronostiquer le score (cette date correspond alors à la date du match aller)

  $update = false;

  switch($matchesType) {
    case 1:
    case 2:
    case 4:
    case 5: $update = checkNormalMatch($matchesDate);
    break;
    case 3: $update = checkSpecialMatch($forecastActionCode, $matchesDate, $matchesDateMax);
    break;
  }

  if($update == false) {
    // Mise à jour autorisée
    switch($forecastActionCode) {
      case 0: updateScoreA($match, $pronosticsScoreEquipeDomicile); break;
      case 1: updateScoreB($match, $pronosticsScoreEquipeVisiteur); break;
      case 2: updateScoreExtraA($match, $pronosticsScoreAPEquipeDomicile); break;
      case 3: updateScoreExtraB($match, $pronosticsScoreAPEquipeVisiteur); break;
      case 4: updateShootingWinner($match, $pronosticsVainqueur); break;
      case 5: addScorer(); break;
      case 6: removeScorer(); break;
    }
  }

  $forceaster = 1;

  // Vérification de la date du match pour éviter que l'on ne mette pas à jour un match passé
  // Attention aussi au fait que l'on ne puisse pas non plus mettre à jour le score d'un match retour de confrontation directe
?>
