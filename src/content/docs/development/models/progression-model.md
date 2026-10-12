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

## Format du fichier de sauvegarde

Chaque sous-modèle expose `save() -> Dictionary` et `from_dictionary(data: Dictionary)`.

Le fichier est `user://progression.dat` (`ProgressionManager.SAVE_PATH`). Ce n'est pas du JSON: `save_game()` enchaîne des dictionnaires écrits avec `FileAccess.store_var`, et `load_game()` les relit avec `get_var` jusqu'à la fin du fichier. Chaque dictionnaire a une clé `type`:

| `type` | Clé `id` | Autres champs | Nombre |
|---|---|---|---|
| `enemy` | id de l'ennemi | `seen`, `encyclopedia_seen` | un par ennemi |
| `level` | `lev.XX` | `unlocked`, `challenges_completed` | un par niveau |
| `parameters` | non | `language`, `music_enabled`, `sound_enabled`, `armory_intro_seen`, `tutorial_completed` | un |
| `tower` | `bat_XX` | `unlocked`, `encyclopedia_seen` | un par tour |
| `trap` | `bat_XX` | `unlocked` | un par piège |
| `armory` | non | `purchased` (ids de nœuds), `legacy_mode` | un |

`ProgressionData.save()` renvoie la même information sous forme d'un seul dictionnaire (`enemies`, `levels`, `parameters`, `towers`, `traps`, `armory_purchased`, `armory_legacy_mode`), utilisé pour les logs de debug. Les enregistrements inconnus ou sans `type` sont ignorés au chargement.

## Flux métier

1. Au démarrage, `ProgressionManager._ready()` appelle `load_game()`: valeurs par défaut (`lev.01` débloqué, seules les tours de départ constructibles), puis lecture du fichier. Sans fichier, les valeurs par défaut sont sauvegardées.
2. En cours de partie, les déblocages, défis et découvertes modifient `data`.
3. Les accesseurs (`complete_challenge`, `unlock_level`, `unlock_tower`, `mark_*`...) appellent `save_game()`. `UI.end_level()` sauvegarde aussi.
4. À la fin du chargement, `apply_settings()` réapplique la langue ([Traductions](/documentation/development/guides/i18n/#langue-du-joueur)) et le volume ([Audio](/documentation/development/guides/audio/#réglages-du-joueur)).
5. `complete_level(level_id)` débloque le niveau portant le numéro suivant ([Créer un niveau](/documentation/development/guides/levels-and-arcs/#arcs)). `reset_progression()` remet les valeurs par défaut.

## Cas legacy

Si une vieille sauvegarde ne contient pas de bloc `armory`, le système active `armory_legacy_mode` et débloque tous les bâtiments pour éviter de bloquer les anciens joueurs.

## Bonnes pratiques

- Les `from_dictionary` restent tolérants: valeurs par défaut, aucune clé supposée présente.
- Toute migration vit dans `ProgressionManager`, pas dans les modèles.
