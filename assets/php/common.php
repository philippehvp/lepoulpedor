<?php

  ini_set('session.gc_maxlifetime', '86400');
  session_start();

  $pronostiqueur = 1;
  $_SESSION["pronostiqueur"] = $pronostiqueur;

  // Connexion à la base de données
  try {
    if($_SERVER['HTTP_HOST'] == 'localhost') {
      $db = new PDO('mysql:host=localhost;dbname=lepoulpeg', 'root', '', array(\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
    }
    else {
      $db = new PDO('mysql:host=mysql51-119.perso;dbname=lepoulpeg', 'lepoulpeg', 'Allezlom2014', array(\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
    }
  }
  catch(Exception $e) {
    die('Database error: ' . $e->getMessage());
  }

?>
