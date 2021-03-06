<?php
    include_once('common.php');

    // Lecture des options de menu pour savoir s'il faut les afficher ou non
    $ordreSQL =     '   SELECT      (SELECT Menus_Visible FROM menus WHERE Menu = 100) AS Menu100' .
                    '               ,(SELECT Menus_Visible FROM menus WHERE Menu = 110) AS Menu110' .
                    '               ,(SELECT Menus_Visible FROM menus WHERE Menu = 120) AS Menu120' .
                    '               ,(SELECT Menus_Visible FROM menus WHERE Menu = 130) AS Menu130' .
                    '               ,(SELECT Menus_Visible FROM menus WHERE Menu = 140) AS Menu140' .
                    '               ,(SELECT Menus_Visible FROM menus WHERE Menu = 150) AS Menu150';
    $req = $db->query($ordreSQL);
    $menus = $req->fetchAll();
    $menu100 = $menus[0]["Menu100"];
    $menu110 = $menus[0]["Menu110"];
    $menu120 = $menus[0]["Menu120"];
    $menu130 = $menus[0]["Menu130"];
    $menu140 = $menus[0]["Menu140"];
    $menu150 = $menus[0]["Menu150"];
?>

<nav class="navbar navbar-default">
  <div class="container-fluid">
    <ul class="nav navbar-nav">
      <li>
        <a ui-sref="accueil">Accueil</a>
      </li>

      <li class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Pronostics <span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li ng-if="ctrl.generalService.getUser() != null && ctrl.generalService.getUser() != undefined">
            <a ui-sref="pronostics">Journées en cours</a>
          </li>

          <?php
            if($menu100 == 1)
              echo '<li><a href="#">Consulter les bonus</a></li>';
          ?>

          <?php
            if($menu140 == 1)
              echo '<li><a href="#">Consulter les barèmes de bonus</a></li>';
          ?>

          <?php
            if($menu110 == 1)
              echo '<li><a href="#">Consulter les classements de poule</a></li>';
          ?>

          <?php
            if($menu120 == 1)
              echo '<li><a href="#">Saisir les bonus de Ligue 1</a></li>';
          ?>

          <?php
            if($menu130 == 1)
              echo '<li><a href="#">Saisir les qualifications des poules européennes</a></li>';
          ?>

          <li role="separator" class="divider"></li>
          <li class="dropdown-submenu">
            <a tabindex="-1" href="#">Trophées</a>
            <ul class="dropdown-menu">
              <li><a tabindex="-1" href="#">Ligue 1</a></li>
              <li><a href="#">Ligue des Champions</a></li>
              <li><a href="#">Europa League</a></li>
            </ul>
          </li>
          <li role="separator" class="divider"></li>
          <li class="dropdown-submenu">
            <a tabindex="-1" href="#">Résultats</a>
            <ul class="dropdown-menu">
              <li><a tabindex="-1" href="#">Ligue 1</a></li>
              <li><a href="#">Ligue des Champions</a></li>
              <li><a href="#">Europa League</a></li>
              <li><a href="#">Barrages</a></li>
            </ul>
          </li>
          <li role="separator" class="divider"></li>
          <li class="dropdown-submenu">
            <a tabindex="-1" href="#">Concours 2016-2017</a>
            <ul class="dropdown-menu">
              <li><a tabindex="-1" href="#">Les joueurs</a></li>
              <li><a href="#">Le règlement</a></li>
            </ul>
          </li>
        </ul>
      </li>

      <li>
        <a ui-sref="classements">Classements</a>
      </li>

      <li class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Contest Centre <span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li><a ui-sref="contest.pronostiqueurs">Pronostiqueurs</a></li>
          <li><a ui-sref="contest.buteurs">Buteurs</a></li>
          <li><a ui-sref="contest.palmares">Palmarès</a></li>
          <li><a ui-sref="contest.points">Points</a></li>
          <li><a ui-sref="contest.l1">Ligue 1</a></li>
          <li><a ui-sref="contest.classements-general">Classement général</a></li>
          <li><a ui-sref="contest.classements-journee">Classement journée</a></li>
          <li><a ui-sref="contest.equipes">Equipes</a></li>
        </ul>
      </li>

      <?php
        if($menu150 == 1)
            echo '<li><a ng-href="#/">Coupe de France</a></li>';
      ?>
    </ul>
    <ul class="nav navbar-nav navbar-right">
      <li ng-if="ctrl.generalService.getUser() == null || ctrl.generalService.getUser() == undefined">
        <a ui-sref="connexion">Connexion</a>
      </li>
      <li ng-if="ctrl.generalService.getUser() != null && ctrl.generalService.getUser() != undefined">
        <a ng-click="ctrl.generalService.logout()">Déconnexion</a>
      </li>
    </ul>
  </div>
</nav>
