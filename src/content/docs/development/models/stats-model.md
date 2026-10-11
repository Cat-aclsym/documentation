---
title: Stats Model
description: StatsDB et stats.json, source des statistiques de combat
sidebar:
  order: 100
---

## Description

`StatsDB` (autoload) charge `res://assets/resources/configs/stats.json` au démarrage et expose les statistiques des tours, pièges, ennemis et upgrades.

**Règle:** ne jamais écrire de valeur de stat dans le GDScript. Toute valeur de combat passe par `stats.json`.

## Structure du JSON

Le fichier contient quatre clés racines:

- `towers`: tours (`bat_01`, `bat_02`, `bat_08`, `bat_09`)
- `traps`: pièges (`bat_03` à `bat_07`)
- `enemies`: ennemis (`default_zombie`, `rat`, `big_daddy`, etc.)
- `upgrades`: upgrades de tours (`bat_01_02`, `bat_01_a_04`, etc.)

### Tour

```json
{
  "bat_01": {
    "base": {
      "bullet_stats": { "damage": 25, "speed": 500 },
      "cost": 50,
      "fire_rate": 1.0,
      "projectile_count": 1,
      "shoot_range": 75,
      "spread_angle": 15
    },
    "level": 1,
    "name": "...",
    "scene": "res://scenes/gameplay/entities/tower/towers/bat_01.tscn",
    "upgrades": ["bat_01_02"]
  }
}
```

### Upgrade

Une upgrade contient `bullet_stats`, `tower_stats`, `changes`, `next` (upgrades suivantes) et `price`.

### Ennemi

```json
{
  "default_zombie": {
    "max_health": 50,
    "reward": 20,
    "scene": "res://scenes/gameplay/entities/enemy/enemies/ene.01.tscn",
    "speed": 35
  }
}
```

Les pièges sont décrits dans [Trap Model](/documentation/development/models/trap-model/).

## API StatsDB

- Lecture: `get_tower(id)`, `get_enemy(id)`, `get_trap(id)`, `get_upgrade(id)`
- Noms et niveaux: `get_tower_name(id)`, `get_tower_level(id)`, `get_trap_name(id)`
- Upgrades: `get_upgrade_price(id)`, `get_upgrade_next_ids(id)`, `get_upgrade_tower_stats(id)`, `get_upgrade_bullet_stats(id)`, `get_upgrade_ids_for_tower(id)`
- Listes d'ids: `get_tower_ids()`, `get_enemy_ids()`, `get_trap_ids()`
- Existence: `has_tower(id)`, `has_enemy(id)`, `has_trap(id)`, `has_upgrade(id)`

## Application des stats

Les tours, pièges et ennemis appliquent leurs stats à l'instanciation depuis `StatsDB` (par exemple `ITower.apply_stats_from_db()`), après quoi l'[armurerie](/documentation/development/models/armory-model/) peut appliquer ses bonus.
