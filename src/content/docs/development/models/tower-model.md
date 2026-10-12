---
title: Tour (ITower)
description: Ciblage, tir, états et upgrades d'une tour
sidebar:
  label: Tour
  order: 40
---

`ITower` est le modèle runtime d'une tour. Elle hérite de `IBuilding`, la classe de base des éléments posés via `BuildPlacement` (tours et pièges). Elle gère la détection des ennemis en portée, le ciblage, le tir des projectiles ([Projectile](/documentation/development/models/projectile-model/)) et l'application des upgrades.

## Contrat public

### Signaux

- `upgrade_started`
- `upgrade_completed`

### Propriétés clés

- `tower_id: String`
- `level: int`
- `sell_price: int`
- `target_type: TargetType` (`FIRST`, `LAST`, `STRONGEST`, `WEAKEST`, `RANDOM`)
- `state: TowerState` (`BUILDING`, `UPGRADING`, `ACTIVE`, `DISABLED`)
- `fire_rate: float`
- `shoot_range: float`
- `projectile_count: int`
- `spread_angle: float`
- `bullet_stats: Dictionary`
- `available_upgrade_ids: Array[String]`

### Méthodes publiques

- `apply_stats_from_db()`
- `fire()`
- `start_upgrade(upgrade_id)`
- `apply_upgrade()`
- `apply_special_modifier(modifiers: Dictionary)`
- `sell_tower()`
- `disable_tower()` et `enable_tower()`: un `EnemyProjectile` désactive une tour (le timer de tir s'arrête, état `DISABLED`).
- `show_range(p_show: bool, smooth: bool = true)`
- `get_display_bullet_stats() -> Dictionary`

## Armurerie

Les achats de l'[armurerie](/documentation/development/models/armory-model/) modifient les tours:

- `ArmoryManager.apply_buffs_to_tower(tower)` applique les bonus de `tower_buff`.
- `ArmoryManager.append_unlocked_upgrade_ids(tower)` ajoute les upgrades débloquées à `available_upgrade_ids`.

## Source des stats

Les stats de base et les upgrades viennent de `assets/resources/configs/stats.json` via `StatsDB` ([Statistiques](/documentation/development/models/stats-model/)):

- `towers.<tower_id>.base`
- `towers.<tower_id>.upgrades`
- `upgrades.<upgrade_id>`

## Dépendances

- `StatsDB`
- `ArmoryManager`
- `ILevel` (pièces disponibles)
- `IBullet` (scène du projectile)
