---
title: Projectile Model
description: Modèle projectile (impact, trajectoire, effets visuels)
sidebar:
  order: 35
---

## Description

`IBullet` est la classe de base des projectiles.

Le gameplay (dégâts, vitesse, effets) est appliqué à l'instanciation par la tour via `bullet_stats`.

## Contrat public

### Propriétés clés

- `damage: float`
- `initial_damage: float` (dégâts de départ, pour calculer les réductions en pourcentage)
- `speed: int`
- `trail_enabled: bool` (active la traînée configurée dans la scène)
- `direction: Vector2`
- `target: Vector2`
- `tower_owner: ITower`

## Sous-classes

Scènes et scripts dans `scenes/gameplay/entities/bullet/`:

- `AOEArrow` (`aoe_arrow`) et `FireArrow` (`fire_arrow`, hérite de `AOEArrow`)
- `PiercingArrow` (`piercing_arrow`)
- `InfernoBeam` (`inferno_beam`)
- `InstantLightning` (`instant_lightning`)

`EnemyProjectile` (`enemy_projectile`) est un `Area2D` indépendant, qui n'hérite pas de `IBullet`.

### Cycle de vie

1. Spawn par une tour (`fire`).
2. Déplacement en `_physics_process`.
3. Détection de collision (`body_entered`).
4. Application des dégâts à `IEnemy`.
5. Nettoyage (désactivation, smoke, trail detach, free).

## Dépendances

- `ITower` (owner)
- `IEnemy` (cible touchée)
- `Global.paused`
- `SignalUtil`

## Bonnes pratiques

- Éviter les collisions multiples avec un flag d'impact (`_has_impacted`).
- Garder les scènes projectile très simples (VFX) et confier les chiffres à `StatsDB`.
- Ne pas oublier de désactiver le monitoring collision avant cleanup.
