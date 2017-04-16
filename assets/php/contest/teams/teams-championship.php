<?php
  include_once('common.php');

  $postedData = json_decode(file_get_contents("php://input"), true);
  $championship = $postedData["championnat"];
  $europe = $postedData["europe"];

  // La combinaison championnat=1 et europe=1 indique que l'on affiche les équipes européennes de ligue 1
  // Dans les autres cas, le paramètre europe n'est pas utilisé
  if($championship == 1 && $europe == 1) {
    $sql =		'	SELECT		Equipe, Equipes_Nom, Equipes_NomCourt, IFNULL(Equipes_Fanion, \'_inconnu.png\') AS Equipes_Fanion' .
              '	FROM		  equipes' .
              ' JOIN      engagements' .
              '           ON    equipes.Equipe = engagements.Equipes_Equipe' .
              ' WHERE     equipes.Equipes_L1Europe = 1' .
              '           AND   engagements.Championnats_Championnat = ' . $championship .
              '	ORDER BY  IFNULL(Equipes_NomCourt, Equipes_Nom)';
  }
  else {
    $sql =		'	SELECT		Equipe, Equipes_Nom, Equipes_NomCourt, IFNULL(Equipes_Fanion, \'_inconnu.png\') AS Equipes_Fanion' .
              '	FROM		  equipes' .
              ' JOIN      engagements' .
              '           ON    equipes.Equipe = engagements.Equipes_Equipe' .
              ' WHERE     equipes.Equipes_L1Europe IS NULL' .
              '           AND   engagements.Championnats_Championnat = ' . $championship .
              '	ORDER BY  IFNULL(Equipes_NomCourt, Equipes_Nom)';
  }
	$query = $db->query($sql);
	$teams = $query->fetchAll();

  echo json_encode($teams);

?>