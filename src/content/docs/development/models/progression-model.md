---
title: Progression Model
description: Modèle racine de sauvegarde (enemies, levels, towers, traps, settings, armory)
sidebar:
  order: 70
---

## Description

`ProgressionData` est le modèle racine de la sauvegarde du joueur.

Il centralise:

- progression de niveaux et challenges
- découverte ennemi/tour
- unlocks de tours et pièges
- paramètres globaux
- état de l'armurerie méta

Le manager associé est `ProgressionManager` (autoload), qui charge et sauvegarde `user://progression.dat`.

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

- Garder les `from_dictionary` tolérants (valeurs par défaut).
- Ne jamais supposer qu'une clé existe dans la sauvegarde.
- Isoler toute migration dans `ProgressionManager` pour éviter de complexifier les modèles.
