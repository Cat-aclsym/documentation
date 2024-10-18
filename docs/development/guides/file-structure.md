---
title: Structure des fichiers
sidebar_position: 2
description: GDScript project files structure
---

# Structure des fichiers GDScript

La structure des fichiers pour le projet est organisée de manière à séparer les différents types de ressources, scènes, scripts, et autres éléments importants.

- **addons/** : Contient les plugins Godot utilisés dans le projet.

- **assets/** : Stocke toutes les ressources du jeu comme les fichiers audio, les sprites, et les traductions.
  - **audio/** : Inclut la musique et les effets sonores.
  - **environment/** : Ressources liées à l'environnement, telles que les arrière-plans et les tilesets.
  - **gameplay/** : Actifs utilisés pour les mécaniques de jeu (projectiles, tower, etc.).
  - **resources/** : Fichiers de ressources spécifiques à Godot (thèmes, matériaux, etc.).
  - **translations/** : Fichiers de traduction pour supporter plusieurs langues.
  - **ui/** : Actifs utilisés pour l'interface utilisateur (boutons, icônes, fonts, etc.).
  
- **scenes/** : Organisation des scènes du projet.
  - **gameplay/** : Scènes liées au gameplay, organisées par entités et le monde de jeu.
    - **entities/** : Composants des entités du jeu (ennemis, tower, etc).
    - **world/** : Contient les scènes relatives à l'environnement de jeu (map, level).
  - **narrative/** : Scènes qui gèrent les aspects narratifs et dialogues. ( _WIP_ )
  - **ui/** : Scènes dédiées à l'interface utilisateur, comme les menus et les HUD.
  - **utilities/** : Scènes utilitaires (debug console, sound entity, etc).

- **scripts/** : Regroupe tous les scripts qui ne sont pas directement liés à une scène spécifique.
  - **autoloads/** : Scripts globaux chargés automatiquement au démarrage du projet.
  - **log/** : Scripts spécifiques pour la gestion des logs et des débogages.

- **project.godot** : Fichier de configuration principal du projet Godot.

---

## Tree

```bash
.res://
├───addons	# Godot plugins
├───assets
│   ├───audio
│   │   ├───music
│   │   └───sounds
│   ├───environment
│   ├───gameplay
│   ├───resources	# Godot resources
│   ├───translations
│   └───ui
├───scenes
│   ├───gameplay
│   │   ├───entities
│   │   │   └───enemy
│   │   │       ├───enemies
│   │   │       │	└───zombie.tscn
│   │   │       ├───ienemy.gd	# script goes next to it related scene
│   │   │       └───ienemy.tscn
│   │   └───world
│   ├───narrative
│   ├───ui
│   └───utilities
├───scripts
│   ├───autoloads
│   └───log
└───project.godot
```

