<?php
  include_once('common.php');

  $sql =		'	SELECT		Pronostiqueur, Pronostiqueurs_NomUtilisateur, IFNULL(Pronostiqueurs_Photo, \'_inconnu.png\') AS Pronostiqueurs_Photo' .
            '	FROM		  pronostiqueurs' .
            '	ORDER BY	Pronostiqueurs_NomUtilisateur';
	$query = $db->query($sql);
	$forecasters = $query->fetchAll();

  echo json_encode($forecasters);

?>