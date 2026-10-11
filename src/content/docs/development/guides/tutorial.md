---
title: Tutoriel
description: Tutoriel du premier niveau et introduction de l'armurerie
sidebar:
  order: 40
---

Le jeu contient un tutoriel guidé sur `lev.01` et un dialogue d'introduction à l'armurerie. Les deux utilisent [Dialogic](/documentation/development/guides/dialogic-guide/).

## Tutoriel du premier niveau

### Composants

- `TutorialManager` (`scenes/ui/tutorial/tutorial_manager.gd`): enfant de la scène `ui.tscn`, il orchestre les dialogues et les objectifs.
- `TutorialOverlay` (`scenes/ui/tutorial/tutorial_overlay.gd`): flèche animée qui pointe un contrôle de l'interface ou un élément du monde.
- `TutorialPlacementHint` (`scenes/gameplay/world/level/tutorial_placement_hint.gd`): indicateur de la tuile à utiliser pendant l'étape de placement.
- Timelines: `res://assets/narrative/tutorial_level_01.en.dtl` et `tutorial_level_01.fr.dtl`.

### Déclenchement

`ui.gd` appelle `TutorialManager.on_level_started(level)` au démarrage d'un niveau, et `on_level_ended()` à sa fin.
Le tutoriel ne démarre que si `level_id == "lev.01"` et que `ProgressionManager.is_tutorial_completed()` est `false`.

Dans `ILevel`, le démarrage des vagues de `lev.01` est différé tant que le tutoriel n'est pas terminé.

### Objectifs

Les timelines émettent des signaux Dialogic `tutorial:<objectif>` (par exemple `tutorial:open_build_menu`), et `TutorialManager` attend l'action correspondante du joueur (enum `Objective`):

1. `OPEN_BUILD_MENU`: ouvrir le menu de construction
2. `SELECT_BUILD_CARD`: choisir une carte de tour
3. `PLACE_CONFIRM`: placer et confirmer la tour
4. `SELECT_TOWER`: sélectionner la tour posée
5. `PRESS_UPGRADE`: appuyer sur le bouton d'amélioration
6. `CONFIRM_UPGRADE`: confirmer l'amélioration (flèche seule, sans dialogue)
7. `PAUSE_AND_RESUME`: mettre en pause puis reprendre

Une fois la tour posée, l'étape de sélection de la tour s'active après 5 kills.

## Introduction de l'armurerie

Au premier affichage du menu armurerie, `armory.gd` vérifie `ProgressionManager.is_armory_intro_seen()`. Si l'intro n'a pas été vue, il appelle d'abord `mark_armory_intro_seen()`, puis `Dialogic.start` sur `armory_intro.<langue>.dtl`.
Si aucun fichier n'existe pour la langue courante, `armory_intro.en.dtl` est utilisé.
Le bouton d'aide de l'armurerie relance le dialogue.

## Voir aussi

- [Progression Model](/documentation/development/models/progression-model/) pour `tutorial_completed` et `armory_intro_seen`
