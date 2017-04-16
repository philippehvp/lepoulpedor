<?php
  include_once('common.php');
  include_once('l1-common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];

  $forecaster = isset($forecaster) ? $forecaster : 0;

	// Liste des pronostiqueurs pour le championnat en question
	$forecasters = readForecasters($db, $forecaster, $championship);
	$forecastersCount = sizeof($forecasters);

  // Points marqués par équipe
	$sql =		'	SELECT		Scores' .
					  '	FROM		  vue_scoresmatchescanal' .
					  '	ORDER BY	Pronostiqueurs_NomUtilisateur';
	$query = $db->query($sql);
	$points = $query->fetchAll();

  $forecastersCanal = array();
  for($i = 0; $i < $forecastersCount; $i++) {
    $canalPoints = array(
      "Scores" => $points[$i]["Scores"]
    );
      array_push($forecastersCanal, $canalPoints);
  }

  $canal = array();
  $canal['Pronostiqueurs'] = $forecasters;
  $canal['Donnees'] = $forecastersCanal;
  echo json_encode($canal);

?>