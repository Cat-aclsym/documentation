---
title: Structure du projet
description: Dossiers du projet Godot, fichiers racine et emplacement des nouveaux fichiers
sidebar:
  label: Structure du projet
  order: 2
---

## Arborescence

```text
res://
├── addons/                 plugins externes (Dialogic), à modifier seulement pour un travail sur le plugin
├── assets/
│   ├── audio/
│   ├── environment/
│   ├── gameplay/
│   ├── narrative/          timelines et personnages Dialogic
│   ├── resources/          thèmes, shaders et configs/stats.json
│   ├── translations/       translations.csv
│   └── ui/
├── resources/              données JSON (levels, arcs, challenges, armory)
├── scenes/
│   ├── gameplay/
│   │   ├── entities/       enemy, tower, trap, building, building_placement, bullet
│   │   └── world/          clock, level, map
│   ├── ui/
│   │   ├── debug/
│   │   ├── menus/
│   │   ├── popup/
│   │   ├── tutorial/
│   │   └── ui.gd
│   ├── utilities/          console, sound_entity
│   ├── watcher/            widget de debug
│   ├── main.tscn           scène principale
│   └── DebugScene.tscn
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
├── export_presets.cfg
└── project.godot
```

Le workflow CI est dans `.github/workflows/build.yml`.

## Dossiers

| Dossier | Contenu |
|---|---|
| `assets/` | Ressources artistiques et audio. Les nouveaux fichiers sont nommés en `snake_case` (certains existants ne le sont pas, par exemple `Button Close.svg`). |
| `assets/narrative/` | Timelines `.dtl` (une par langue) et personnages, voir [Dialogic](/documentation/development/guides/dialogic-guide/). |
| `assets/resources/` | Thèmes, shaders et `configs/stats.json`, la source des stats ([Statistiques](/documentation/development/models/stats-model/)). |
| `resources/` | `levels/` (`lev.01.json` à `lev.08.json`), `arcs/` (`arc.01.json`, `arc.02.json`), `challenges/` (`cha.XXX.json`) et `armory/armory.json`. |
| `scenes/` | Les `.tscn` par domaine. Un script spécifique à une scène reste à côté d'elle. |
| `scripts/` | Logique transverse non attachée à une scène unique. |
| `scripts/autoloads/` | Services globaux, voir [Architecture](/documentation/development/guides/architecture/). |
| `scripts/challenges/` | Classe `Challenge` et logiques dans `logics/cha.XXX.gd`. |
| `scripts/commands/` | Commandes de la console, voir [Console de debug](/documentation/development/guides/console/). |

La scène `scenes/narrative/example/` lance une timeline `example` qui n'existe pas dans le projet.

## Fichiers générés ou ignorés par Git

- `log/` : écrit dans `res://log`, donc seulement depuis l'éditeur ([Logs](/documentation/development/guides/logger/)).
- `*.translation` : générés à l'import, y compris `dialogic_translations.en.translation` et `dialogic_translations.fr.translation` à la racine, déclarés dans `project.godot`.
- `exports/` et `.godot/`.

## Où créer quoi

- Entité, menu ou widget avec une scène : `scenes/...`
- Service global : `scripts/autoloads/...`
- Commande de console : `scripts/commands/...`
- Niveau, arc ou challenge : `resources/...`
- Stats d'une tour, d'un piège ou d'un ennemi : `assets/resources/configs/stats.json`

Les étapes pour ajouter un ennemi, une tour, un piège, un niveau, un défi ou une commande sont dans [Recettes](/documentation/development/guides/recipes/).
