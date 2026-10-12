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
    start(["Début"]) --> waves{"Vagues restantes ?"}
    waves -->|non| win(["Victoire"])
    waves -->|oui| newwave["Nouvelle vague"]
    newwave --> play["Dépenser les ressources"]
    play --> hit{"Ennemi à la base ?"}
    hit -->|oui| hurt["Perte de vie"]
    hit -->|non| gain["Gain de ressources"]
    hurt --> dead{"Vie à 0 ?"}
    dead -->|oui| lose(["Défaite"])
    dead -->|non| clear
    gain --> play
    gain --> clear{"Ennemis morts ?"}
    clear -->|oui| waves
```

La victoire et la défaite mènent à l'écran de fin:

```mermaid
flowchart LR
    win(["Victoire"]) --> endscreen["Écran de fin"]
    lose(["Défaite"]) --> endscreen
    endscreen --> home["Accueil"]
    endscreen --> restart["Recommencer"]
    endscreen -->|victoire seulement| next["Niveau suivant"]
```

Pendant la boucle, le joueur peut à tout moment agir sur l'interface:

| Action | Résultat |
|---|---|
| Bouton de construction | Ouvre le menu des cartes de bâtiments. Une carte verrouillée par l'armurerie ne peut pas être choisie. Valider le placement déduit le coût des pièces |
| Clic sur une tour | Ouvre le menu radial: améliorer ou vendre |
| Bouton des défis | Ouvre le panneau latéral des défis |
| Bouton d'accélération | Multiplie la vitesse du jeu par 3 |
| Bouton pause | Ferme le menu de construction, met le jeu en pause et ouvre le menu pause: reprendre, recommencer, accueil, encyclopédie, musique et son |
| Première apparition d'un ennemi | Popup de nouvel ennemi, jeu en pause le temps de l'animation |

## Boucle de vagues

- Chaque vague enchaîne ses étapes tant que des ennemis restent à faire apparaître. La vague suivante démarre quand il n'y a plus d'étape ni d'ennemi en vie (`ILevel._on_state_wave`).
- Quand il n'y a plus de vague, le niveau passe à l'état victoire. Si la vie tombe à 0, il passe à l'état défaite (`ILevel._set_health`).
- Les états du niveau et le détail d'une vague sont décrits dans [Niveau et carte](/documentation/development/models/level-model/) et [Vagues](/documentation/development/models/wave-model/).

## Tutoriel du premier niveau

Sur `lev.01`, tant que le tutoriel n'est pas terminé, `ILevel.start_level()` ne lance pas les vagues : le `TutorialManager` les démarre après l'objectif de placement d'une tour. Voir [le tutoriel](/documentation/development/guides/tutorial/).

## Écran de fin

L'écran affiche le temps, la vie restante et la liste des défis du niveau avec une étoile pleine ou vide. En cas de victoire, le niveau suivant est débloqué et le bouton « suivant » est visible. En cas de défaite, ce bouton est masqué.
