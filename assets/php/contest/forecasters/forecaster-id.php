<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $viewedForecaster = $postedData["pronostiqueur"];

  $sql =		"	SELECT		Pronostiqueur, Pronostiqueurs_NomUtilisateur, IFNULL(Pronostiqueurs_Photo, '_inconnu.png') AS Pronostiqueurs_Photo" .
            "           ,Pronostiqueurs_EquipeFavorite, Pronostiqueurs_Ambitions" .
            "           ,Pronostiqueurs_Palmares, Pronostiqueurs_Carriere" .
            "           ,Pronostiqueurs_Commentaire" .
            "	FROM		  pronostiqueurs" .
            "	WHERE     Pronostiqueur = " . $viewedForecaster;
	$query = $db->query($sql);
	$forecaster = $query->fetchAll();

  echo json_encode($forecaster);

?>