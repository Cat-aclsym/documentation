---
title: Progression et sauvegarde
description: ProgressionData, sous-modèles de sauvegarde et flux de ProgressionManager
sidebar:
  label: Progression
  order: 90
---

`ProgressionData` est le modèle racine de la sauvegarde du joueur: progression des niveaux et des défis, ennemis et tours découverts, unlocks de tours et de pièges, paramètres et état de l'armurerie. `ProgressionManager` (autoload) la charge et la sauvegarde dans `user://progression.dat`.

## Structure principale

```gdscript
var enemies: Dictionary
var levels: Dictionary
var parameters: SettingsData
var towers: Dictionary
var traps: Dictionary
var armory_purchased: Array[String]
var armory_legacy_mode: bool
```

## Sous-modèles

### EnemyData

- `seen: bool`
- `encyclopedia_seen: bool`

### LevelData

- `unlocked: bool`
- `challenges_completed: Array[String]`

### TowerData

- `unlocked: bool`
- `encyclopedia_seen: bool`

### TrapData

- `unlocked: bool`

### SettingsData

- `language: String` (par défaut `fr`)
- `music_enabled: bool`
- `sound_enabled: bool`
- `armory_intro_seen: bool`: le dialogue d'introduction de l'armurerie a été vu
- `tutorial_completed: bool`: le tutoriel du premier niveau est terminé

`ProgressionManager` expose les accesseurs `is_tutorial_completed()`, `mark_tutorial_completed()`, `is_armory_intro_seen()` et `mark_armory_intro_seen()`.
Voir [Tutoriel](/documentation/development/guides/tutorial/).

## Serialization

Chaque sous-modèle expose:

- `save() -> Dictionary`
- `from_dictionary(data: Dictionary) -> void`

`ProgressionManager.save_game()` écrit des blocs types (`enemy`, `level`, `parameters`, `tower`, `trap`, `armory`) dans `progression.dat`.

## Flux métier

1. Au boot: `_init_default_data()` puis `load_game()`.
2. En cours de partie: unlocks / challenges / découvertes modifient `data`.
3. À chaque événement clé: `save_game()` enregistre l'état.
4. Au chargement: `apply_settings()` réapplique langue et audio.

## Cas legacy

Si une vieille sauvegarde ne contient pas de bloc `armory`, le système active `armory_legacy_mode` et débloque tous les bâtiments pour éviter de bloquer les anciens joueurs.

## Bonnes pratiques

- Les `from_dictionary` restent tolérants: valeurs par défaut, aucune clé supposée présente.
- Toute migration vit dans `ProgressionManager`, pas dans les modèles.
