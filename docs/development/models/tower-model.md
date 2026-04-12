---
title: Tower Model
sidebar_position: 30
description: Modèle de tour (ciblage, tir, upgrades)
---

# Tower

## Description

`ITower` est le modèle runtime d'une tour.

Il gère:

- détection des ennemis en portée
- logique de ciblage
- tir des projectiles
- application des upgrades

## Contrat public

### Signaux

- `upgrade_started`
- `upgrade_completed`

### Propriétés clés

- `tower_id: String`
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
- `get_display_bullet_stats() -> Dictionary`

## Source des stats

Les stats de base et upgrades viennent de `assets/resources/configs/stats.json` via `StatsDB`.

Champs clés:

- `towers.<tower_id>.base`
- `towers.<tower_id>.upgrades`
- `upgrades.<upgrade_id>`

## Dépendances

- `StatsDB`
- `ArmoryManager`
- `ILevel` (coins disponibles)
- `IBullet` (scene projectile)
