---
title: Statistiques (StatsDB)
description: Structure de stats.json et API de StatsDB, source des statistiques de combat
sidebar:
  label: Statistiques
  order: 70
---

`StatsDB` (autoload) charge `res://assets/resources/configs/stats.json` au démarrage avec `JsonUtil.load_dict()` et expose les statistiques des tours, pièges, ennemis, projectiles et upgrades.

**Règle:** ne jamais écrire de valeur de stat dans le GDScript. Toute valeur de combat passe par `stats.json`.

## Structure du JSON

Le fichier contient six clés racines:

- `towers`: tours (`bat_01`, `bat_02`, `bat_08`, `bat_09`)
- `traps`: pièges (`bat_03` à `bat_07`)
- `enemies`: ennemis (`default_zombie`, `damage_zombie`, `rat`, `splitter_zombie`, `small_zombie`, `minesweeper`, `big_daddy`)
- `upgrades`: upgrades de tours (`bat_01_02`, `bat_01_a_04`, etc.)
- `bullets`: constantes de gameplay de certains projectiles
- `tile_modifiers`: multiplicateurs des cases bonus et malus de la carte

Les entrées n'ont pas de champ `"name"`: le nom affiché vient de la traduction `TOWER.<ID>.NAME`, `TRAP.<ID>.NAME` ou `ENEMY.<ID>.NAME` ([Traductions](/documentation/development/guides/i18n/)).

### Tour

```json
{
  "bat_01": {
    "base": {
      "bullet_stats": { "damage": 25, "speed": 500, "pierce_count": 0 },
      "cost": 50,
      "fire_rate": 1.0,
      "projectile_count": 1,
      "shoot_range": 75,
      "spread_angle": 15
    },
    "level": 1,
    "scene": "res://scenes/gameplay/entities/tower/towers/bat_01.tscn",
    "upgrades": ["bat_01_02"]
  }
}
```

(`bullet_stats` est abrégé: l'entrée réelle liste aussi `aoe_*`, `burn_*`, `damage_multiplier`, `pierce_reduction`.)

### Upgrade

Une upgrade contient `bullet_stats` et `tower_stats` (des deltas ajoutés aux stats de la tour), `changes` (`bullet_stat`, `tower_stat`, `bullet_model`: quels blocs s'appliquent), `next` (upgrades suivantes), `price` et, pour une upgrade qui change de projectile, `bullet_scene_path`.

```json
{
  "bat_01_a_04": {
    "bullet_scene_path": "res://scenes/gameplay/entities/bullet/piercing_arrow.tscn",
    "bullet_stats": { "damage": 27, "pierce_count": 1, "pierce_reduction": 10, "speed": -200 },
    "changes": { "bullet_model": true, "bullet_stat": true, "tower_stat": true },
    "next": ["bat_01_a_05"],
    "price": 125,
    "tower_stats": { "level": 1, "shoot_range": 30 }
  }
}
```

### Ennemi

```json
{
  "default_zombie": {
    "escape_damage": 5,
    "max_health": 50,
    "reward": 20,
    "scene": "res://scenes/gameplay/entities/enemy/enemies/ene.01.tscn",
    "speed": 35
  },
  "big_daddy": {
    "escape_damage": 5,
    "extra": { "attack_cooldown": 5, "attack_duration": 1, "post_attack_delay": 1, "pre_attack_delay": 1, "shoot_range": 100, "tower_disable_duration": 3 },
    "max_health": 700,
    "reward": 400,
    "scene": "res://scenes/gameplay/entities/enemy/enemies/big_daddy.tscn",
    "speed": 20
  }
}
```

- `reward`: pièces rendues à la mort, multipliées par le `reward_multiplier` de la tour qui porte le coup fatal.
- `escape_damage`: points de vie retirés à la base quand l'ennemi arrive au bout du chemin.
- `extra` (optionnel): clés propres à un ennemi (`spawn_count` pour `splitter_zombie`, `trap_disable_duration` pour `minesweeper`, les délais et la portée de `big_daddy`), écrites par `StatsDB.apply_fields` dans la propriété du même nom.

La clé de l'entrée est l'`enemy_id` utilisé dans les vagues et dans l'export `enemy_id` de la scène ([Ennemi](/documentation/development/models/enemy-model/)).

### Projectiles (`bullets`)

```json
{
  "bullets": {
    "aoe_arrow": { "aoe_damage_multiplier": 0.75 },
    "fire_arrow": { "base_burn_damage": 5, "burn_damage_multiplier": 0.5, "burn_tick_time": 1.0 }
  }
}
```

Constantes lues par `AOEArrow` et `FireArrow` via `StatsDB.get_bullet(id)` ([Projectile](/documentation/development/models/projectile-model/)).

### Modificateurs de case (`tile_modifiers`)

```json
{
  "tile_modifiers": {
    "bonus": [{ "stat": "fire_rate", "multiplier": 1.3 }, { "stat": "damage", "multiplier": 1.3 }, { "stat": "reward_multiplier", "multiplier": 1.5 }],
    "malus": [{ "stat": "fire_rate", "multiplier": 0.7 }, { "stat": "damage", "multiplier": 0.7 }, { "stat": "shoot_range", "multiplier": 0.7 }]
  }
}
```

`IMap` assigne ces modificateurs aux cases bonus et malus dans l'ordre déclaré ([Construction](/documentation/development/guides/building-placement/#tuiles-spéciales)). `stat` doit être dans `ITower.MODIFIER_STATS` (`damage`, `fire_rate`, `reward_multiplier`, `shoot_range`).

Les pièges sont décrits dans [Piège](/documentation/development/models/trap-model/).

## API StatsDB

- Lecture: `get_tower(id)`, `get_enemy(id)`, `get_trap(id)`, `get_upgrade(id)`, `get_bullet(id)`
- Scène d'un ennemi: `get_enemy_scene(id) -> PackedScene`, chargée à la première demande puis mise en cache. Renvoie `null` et logue une erreur si l'id est inconnu ou si la scène ne se charge pas.
- Cases: `get_tile_modifiers(kind) -> Array[Dictionary]` (`kind` vaut `"bonus"` ou `"malus"`, chaque entrée est `{"stat": String, "multiplier": float}`)
- Nom: `name_key(category, id) -> String`, par exemple `StatsDB.name_key("TOWER", "bat_01")` donne `TOWER.BAT_01.NAME` (`category` vaut `"TOWER"`, `"TRAP"` ou `"ENEMY"`)
- Niveaux: `get_tower_level(id)`
- Upgrades: `get_upgrade_price(id)`, `get_upgrade_next_ids(id)`, `get_upgrade_tower_stats(id)`, `get_upgrade_bullet_stats(id)`, `get_upgrade_changes(id)`, `get_upgrade_ids_for_tower(id)`, `get_upgrade_bullet_scene(id)` (charge la scène du champ `bullet_scene_path`)
- Listes d'ids: `get_tower_ids()`, `get_enemy_ids()`, `get_trap_ids()`
- Existence: `has_tower(id)`, `has_enemy(id)`, `has_trap(id)`, `has_upgrade(id)`
- Chargement: `load_packed_scene(path)`
- Application: `apply_fields(target: Object, values: Dictionary)`

Il n'y a pas de `get_tower_name` ni de `get_trap_name`: les noms passent par `name_key()` et `tr()`.

`apply_fields` écrit chaque entrée de `values` dans la propriété de `target` qui porte le même nom, convertie au type de cette propriété (`type_convert`). Une clé sans propriété correspondante est ignorée avec un log `WARN`.

```gdscript
StatsDB.apply_fields(trap, StatsDB.get_trap("bat_04")["base"])
```

Une upgrade n'a qu'une clé pour sa scène de projectile: `bullet_scene_path`.

## Application des stats

Les pièges appliquent leur `base` (`ITrap.apply_stats_from_db()`) et les ennemis leur `extra` (`IEnemy._apply_stats_override()`) avec `StatsDB.apply_fields`: ajouter une clé à `stats.json` demande une propriété du même nom sur le script du piège ou de l'ennemi, sans code de lecture. Les tours lisent leurs clés une à une (`ITower.apply_stats_from_db()`). La suite `test_entity_stats` vérifie que chaque scène de piège et d'ennemi reçoit ses stats ([Tests](/documentation/development/guides/testing/)). Ensuite l'[armurerie](/documentation/development/models/armory-model/) peut appliquer ses bonus. Pour une tour, `ITower._recompute_stats()` refait ce calcul à chaque upgrade et à chaque changement de case ([Tour](/documentation/development/models/tower-model/#calcul-des-stats)).
