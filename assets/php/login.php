<?php
	session_start();

	// Connexion à la base de données
	try {
		if($_SERVER['HTTP_HOST'] == 'localhost')
			$db = new PDO('mysql:host=localhost;dbname=lepoulpeg', 'root', '', array(\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
		else
			$db = new PDO('mysql:host=mysql51-119.perso;dbname=lepoulpeg', 'lepoulpeg', 'Allezlom2014', array(\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
	}
	catch(Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}

  $postedData = json_decode(file_get_contents("php://input"), true);
  $login = isset($postedData["login"]) ? $postedData["login"] : '';
	$password = isset($postedData["password"]) ? $postedData["password"] : '';

	$sql =		'	SELECT		Pronostiqueur, Pronostiqueurs_NomUtilisateur, Pronostiqueurs_Prenom, Pronostiqueurs_MotDePasse, Pronostiqueurs_Administrateur' .
            '				    ,IFNULL(Pronostiqueurs_Photo, \'_inconnu.png\') AS Pronostiqueurs_Photo' .
            '				    ,IFNULL(Pronostiqueurs_PremiereConnexion, 1) AS Pronostiqueurs_PremiereConnexion' .
            '				    ,Pronostiqueurs_AfficherTropheesChampionnat' .
            '	FROM		  pronostiqueurs' .
            '	WHERE		  Pronostiqueurs_NomUtilisateur = ?' .
            '				    AND		Pronostiqueurs_MotDePasse = ?' .
            '	LIMIT		1';
	$query = $db->prepare($sql);
	$query->execute(array($login, $password));

	$data = $query->fetchAll();
	if(count($data)) {
		$_SESSION["forecaster"] = $data[0]["Pronostiqueur"];
		$_SESSION["forecasterUserName"] = $data[0]["Pronostiqueurs_NomUtilisateur"];
		$_SESSION["forecasterFirstName"] = $data[0]["Pronostiqueurs_Prenom"];
		$_SESSION["forecasterAdministrator"] = $data[0]["Pronostiqueurs_Administrateur"];
		$_SESSION["forecasterPhoto"] = $data[0]["Pronostiqueurs_Photo"];
		$firstConnection = $data[0]["Pronostiqueurs_PremiereConnexion"];
		$displayTrophy = $data[0]["Pronostiqueurs_AfficherTropheesChampionnat"];
	}

	echo json_encode($data);
	
?>