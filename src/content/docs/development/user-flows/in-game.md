---
title: Parcours en niveau
description: Boucle de vagues, actions du joueur et écran de fin d'un niveau
sidebar:
  label: En niveau
  order: 2
---

Ce que vit le joueur dans un niveau, du lancement à l'écran de fin. Voir aussi le [parcours hors niveau](/documentation/development/user-flows/off-game/).

```mermaid
flowchart TD
    start(["Début du niveau"]) --> tuto{"lev.01 et tutoriel non terminé ?"}
    tuto -->|oui| guide["Tutoriel guidé puis lancement des vagues"]
    tuto -->|non| waves
    guide --> waves
    waves{"Toutes les vagues terminées ?"}
    waves -->|oui| win(["Fin du niveau : victoire"])
    waves -->|non| newwave["Début d'une nouvelle vague"]
    newwave --> spend["Le joueur dépense ses ressources"]
    spend --> reach{"Un ennemi atteint le joueur ?"}
    reach -->|oui| hurt["Le joueur perd de la vie"]
    reach -->|non| gain["Le joueur gagne des ressources"]
    hurt --> dead{"Vie à 0 ?"}
    dead -->|oui| lose(["Fin du niveau : défaite"])
    dead -->|non| clear
    gain --> clear{"Tous les ennemis sont morts ?"}
    gain --> spend
    clear -->|oui| waves
    win --> endscreen["Écran de fin : temps, vie restante, défis avec étoiles"]
    lose --> endscreen
    endscreen --> home["Retour à l'accueil"]
    endscreen --> restart["Recommencer le niveau"]
    endscreen --> next["Niveau suivant, victoire uniquement"]
```

Pendant la boucle, le joueur peut à tout moment agir sur l'interface :

```mermaid
flowchart LR
    build["Bouton de construction"] --> cards["Menu de construction : cartes de bâtiments"]
    cards --> placement["Curseur de placement : valider ou annuler"]
    tower["Clic sur une tour"] --> radial["Menu radial : améliorer ou vendre"]
    challenges["Bouton des défis"] --> panel["Panneau latéral des défis"]
    speed["Bouton d'accélération"] --> fast["Vitesse du jeu multipliée par 3"]
    pause["Bouton pause"] --> pausemenu["Menu pause : reprendre, recommencer, accueil, encyclopédie"]
    spawn["Première apparition d'un ennemi"] --> popup["Popup de nouvel ennemi, jeu en pause"]
```

## Boucle de vagues

- Chaque vague enchaîne ses étapes tant que des ennemis restent à faire apparaître. La vague suivante démarre quand il n'y a plus d'étape ni d'ennemi en vie (`ILevel._on_state_wave`).
- Quand il n'y a plus de vague, le niveau passe à l'état victoire. Si la vie tombe à 0, il passe à l'état défaite (`ILevel._set_health`).
- Les états du niveau et le détail d'une vague sont décrits dans [Niveau et carte](/documentation/development/models/level-model/) et [Vagues](/documentation/development/models/wave-model/).

## Tutoriel du premier niveau

Sur `lev.01`, tant que le tutoriel n'est pas terminé, `ILevel.start_level()` ne lance pas les vagues : le `TutorialManager` les démarre après l'objectif de placement d'une tour. Voir [le tutoriel](/documentation/development/guides/tutorial/).

## Pendant le niveau

- **Construction** : le bouton de construction ouvre le menu des cartes. Une carte verrouillée par l'armurerie ne peut pas être choisie. Valider le placement déduit le coût du bâtiment des pièces.
- **Amélioration** : un clic sur une tour active ouvre un menu radial avec l'amélioration et la vente.
- **Pause** : le bouton pause ferme le menu de construction, met le jeu en pause et ouvre le menu pause (reprendre, recommencer, retour à l'accueil, encyclopédie, musique et son).
- **Nouvel ennemi** : la première fois qu'un ennemi de ce type apparaît, une popup le présente et met le jeu en pause le temps de l'animation.

## Écran de fin

L'écran affiche le temps, la vie restante et la liste des défis du niveau avec une étoile pleine ou vide. En cas de victoire, le niveau suivant est débloqué et le bouton « suivant » est visible. En cas de défaite, ce bouton est masqué.
