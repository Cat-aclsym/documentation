---
title: Caméra et effets
description: Déplacement, zoom et secousses de la caméra du niveau, et comment les déclencher
sidebar:
  label: Caméra
  order: 42
---

La caméra est la classe `Camera` (`scripts/camera/camera.gd`, un `Camera2D`). Chaque carte en contient une (`Camera2D` de `i_map.tscn`), qui s'enregistre dans `Global.camera` à son `_ready()`. `IMap` règle ses limites d'après la `TileMap` (marge de 64 px) et sa position initiale (`initial_camera_position`, voir [Créer un niveau](/documentation/development/guides/levels-and-arcs/#1-la-carte)).

## Contrôles

Rien n'est traité quand `Global.paused` est vrai.

| Entrée | Effet |
|---|---|
| Un doigt qui glisse (ou clic glissé) | Déplace la caméra (`pan_speed`), bornée aux limites |
| Deux doigts | Zoom par pincement |
| Molette de la souris (actions `scroll_up` et `scroll_down`) | Zoom |

Le zoom reste entre `min_zoom` (1) et `max_zoom` (10). Les valeurs par défaut sont des exports (`zoom_speed`, `pan_speed`, `random_strength`, `shake_fade`, `min_zoom`, `max_zoom`, `bottom_padding`). La caméra ne lit que les événements tactiles. Sur ordinateur, le projet émule le toucher avec la souris (`pointing/emulate_touch_from_mouse` dans `project.godot`), donc un clic maintenu et glissé déplace la caméra.

## Secousses

| Méthode | Usage |
|---|---|
| `shake_camera()` | Secousse de force `random_strength` (30 par défaut) |
| `shake_camera_with_strength(strength)` | Secousse de force donnée |
| `handle_effect(effect, value)` | Point d'entrée par nom: `"shake"` avec une force optionnelle, les autres noms sont ignorés |

La force décroît jusqu'à 0 (`shake_fade`). Sources actuelles:

- Un `IEnemy` de type `FAT` ou `BIG_DADDY` connecte son signal `camera_effect` à `handle_effect` et émet `shake` à son apparition.
- La bombe (`bat_05`) appelle `handle_effect("shake", 15.0)`.
- Le HUD secoue avec une force de 7 quand la base perd de la vie, et `IMap` avec 10 à l'apparition des tuiles bonus.

Vérifier que `Global.camera` n'est pas nulle avant un appel hors niveau ([Patterns Godot](/documentation/development/guides/godot-patterns/#accès-au-global)).

## Tutoriel

Le [tutoriel](/documentation/development/guides/tutorial/) centre la caméra sur l'indice de placement puis désactive son `process` et son `input`, et les restaure à la fin.
