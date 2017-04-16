<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];

  $sql =		'	SELECT		Pronostiqueur, Pronostiqueurs_NomUtilisateur, IFNULL(Pronostiqueurs_Photo, \'_inconnu.png\') AS Pronostiqueurs_Photo' .
            '	FROM		  pronostiqueurs' .
            ' JOIN      inscriptions' .
            '           ON    pronostiqueurs.Pronostiqueur = inscriptions.Pronostiqueurs_Pronostiqueur' .
            ' WHERE     inscriptions.Championnats_Championnat = ' . $championship .
            '	ORDER BY	Pronostiqueurs_NomUtilisateur';
	$query = $db->query($sql);
	$forecasters = $query->fetchAll();
 
  echo json_encode($forecasters);

?>