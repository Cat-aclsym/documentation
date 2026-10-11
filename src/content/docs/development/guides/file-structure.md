---
title: Structure des fichiers
description: Organisation recommandée du projet Godot Cat'aclysm
sidebar:
  order: 2
---

Cette page décrit l'organisation des dossiers du projet Godot et les conventions associées.
Le but est de retrouver rapidement une feature, éviter les doublons et garder un découpage stable dans le temps.

## Vue d'ensemble

Arborescence principale:

- `addons/`: plugins externes (à ignorer pour le gameplay courant)
- `assets/`: ressources artistiques et audio
- `resources/`: données de configuration (JSON, ressources de progression, etc.)
- `scenes/`: composition visuelle des fonctionnalités
- `scripts/`: logique transverse et systèmes réutilisables
- `log/`: logs runtime générés

## Règle pratique importante

Par défaut, on ne modifie pas `addons/` sauf si le travail concerne explicitement un plugin ou une dépendance vendored.

## Détail par dossier

### assets/

Contient les éléments de production:

- `audio/`: musique et SFX
- `gameplay/`: sprites des tours, ennemis, projectiles, pièges et personnages
- `environment/`: fonds, tilesets, grille de placement, effets de tuiles
- `narrative/`: timelines et personnages Dialogic (voir [Guide Dialogic](/documentation/development/guides/dialogic-guide/))
- `ui/`: icônes, fonts, textures
- `translations/`: fichiers de traduction (`translations.csv`, EN et FR)
- `resources/`: ressources internes Godot (thèmes, shaders) et `configs/stats.json`

Conseils:

- conserver une convention de nommage en `snake_case`
- regrouper par usage réel (`ui/`, `gameplay/`, `environment/`)
- maintenir le pixel art en filtrage nearest

### scenes/

Regroupe les `.tscn` par domaine fonctionnel:

- `gameplay/entities/`: `enemy/`, `tower/`, `trap/`, `building/`, `building_placement/`, `bullet/`
- `gameplay/world/`: `clock/`, `level/` (niveaux `levels/lev.XX.tscn`), `map/` (maps dans `maps/`)
- `ui/`: `menus/` (home, hud, level_selection, armory, pause, end_game, options, tower_upgrade, building_selection), `popup/`, `tutorial/`, `debug/`
- `utilities/`: outils debug (console, `sound_entity`)
- `watcher/`: widget de debug affichant en temps réel la propriété d'un nœud
- `narrative/`: scène d'exemple Dialogic
Conventions:

- préférer des scènes auteurs (nœuds déjà composés)
- limiter la création dynamique de nœuds aux cas réellement nécessaires
- garder le script proche de sa scène quand il est spécifique à cette scène

### scripts/

Scripts de logique globale non attachés à une scène unique:

- `autoloads/`: services globaux (`Global`, `SoundManager`, `ScenesLoader`, `StatsDB`, `ProgressionManager`, `ChallengeManager`, `ArmoryManager`, `FirebaseTestLab`). `Dialogic` est un autoload fourni par l'addon (`addons/dialogic/`).
- `camera/`: déplacement et zoom de la caméra
- `challenges/`: classe `Challenge` et scripts de logique (`logics/cha.XXX.gd`)
- `commands/`: commandes console implémentant `ICommand`
- `log/`: système de logs
- `progression/`: classes de données de sauvegarde (`ProgressionData`, `LevelData`, `TowerData`, etc.)
- `state_machine/`: infrastructure de machine d'états (`StateMachine`, `State`, `Transition`, factories et builder)
- `ui/`: helpers d'interface
- `utilities/`: helpers transverses (`signals/signal_util.gd`)
- `wave/`: `Wave`, `WaveStep`, `WaveStepSpawn`, `WaveStepWait`

Conventions:

- organiser par domaine métier
- éviter les scripts fourre-tout
- conserver des API stables pour les systèmes partagés

### resources/

Contient les fichiers de données:

- `levels/`: définition des vagues (`lev.01.json` à `lev.08.json`)
- `arcs/`: regroupement des niveaux (`arc.01.json`, `arc.02.json`)
- `challenges/`: définition des challenges (`cha.XXX.json`)
- `armory/`: graphe de l'armurerie (`armory.json`)

Les stats des tours, pièges, ennemis et upgrades ne sont pas ici: elles sont dans `assets/resources/configs/stats.json`.

### log/

Dossier de sortie runtime pour les fichiers de logs de session.

Format attendu des noms de fichiers: `YYYY_MM_DD-hh_mm.log`.

## Exemple d'arborescence (simplifié)

```text
res://
├── addons/
├── assets/
│   ├── audio/
│   ├── environment/
│   ├── gameplay/
│   ├── narrative/
│   ├── resources/configs/stats.json
│   ├── translations/
│   └── ui/
├── resources/
│   ├── arcs/
│   ├── armory/
│   ├── challenges/
│   └── levels/
├── scenes/
│   ├── gameplay/
│   │   ├── entities/
│   │   │   ├── enemy/
│   │   │   ├── tower/
│   │   │   ├── trap/
│   │   │   ├── building/
│   │   │   ├── building_placement/
│   │   │   └── bullet/
│   │   └── world/
│   │       ├── clock/
│   │       ├── level/
│   │       └── map/
│   ├── ui/
│   ├── utilities/
│   ├── watcher/
│   └── narrative/
├── scripts/
│   ├── autoloads/
│   ├── camera/
│   ├── challenges/
│   ├── commands/
│   ├── log/
│   ├── progression/
│   ├── state_machine/
│   ├── ui/
│   ├── utilities/
│   └── wave/
├── log/
└── project.godot
```

## Où créer quoi?

- Nouvelle entité gameplay avec composition visuelle: `scenes/gameplay/...`
- Nouveau service global: `scripts/autoloads/...`
- Nouvelle commande de console: `scripts/commands/...`
- Nouveau helper transverse: `scripts/utilities/...`
- Nouveau niveau, arc ou challenge: `resources/...`
- Nouvelles stats de tour, piège ou ennemi: `assets/resources/configs/stats.json`

## Exemples concrets

1. Ajouter une commande debug `spawn_enemy`
   - script dans `scripts/commands/spawn_enemy.gd`
   - implémentation `extends ICommand`
   - déclaration des arguments via `get_args()`

2. Ajouter un nouvel ennemi
   - scène dans `scenes/gameplay/entities/enemy/enemies/`
   - script dérivé de `IEnemy`
   - stats via `StatsDB`

3. Ajouter une nouvelle UI persistante
   - scène dans `scenes/ui/`
   - script `Control` ou `CanvasLayer`
   - référence stockée dans `Global` si nécessaire

## Liens utiles

- [Directives de code](/documentation/development/guides/coding-guidelines/)
- [Logger](/documentation/development/guides/logger/)
- [Console](/documentation/development/guides/console/)
