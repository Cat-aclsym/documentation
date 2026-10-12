---
title: Projectile (IBullet)
description: Propriétés et sous-classes des projectiles de tour, et projectile ennemi qui désactive une tour
sidebar:
  label: Projectile
  order: 50
---

`IBullet` est la classe de base des projectiles de tour. Dégâts, vitesse et effets sont appliqués à l'instanciation par la tour via `bullet_stats`.

## Contrat public

### Propriétés clés

- `damage: float`
- `initial_damage: float` (dégâts de départ, pour calculer les réductions en pourcentage)
- `speed: int`
- `trail_enabled: bool` (active la traînée configurée dans la scène)
- `direction: Vector2`
- `target: Vector2`
- `tower_owner: ITower`

### Cycle de vie

1. Spawn par la tour.
2. Déplacement en `_physics_process`.
3. Détection de collision (`body_entered`).
4. Application des dégâts à `IEnemy`.
5. Nettoyage (désactivation, smoke, trail detach, free).

## Sous-classes

Scènes et scripts dans `scenes/gameplay/entities/bullet/`:

- `AOEArrow` (`aoe_arrow`) et `FireArrow` (`fire_arrow`, hérite de `AOEArrow`)
- `PiercingArrow` (`piercing_arrow`)
- `InfernoBeam` (`inferno_beam`)
- `InstantLightning` (`instant_lightning`)

## EnemyProjectile

`EnemyProjectile` (`enemy_projectile`) est un `Area2D` indépendant, qui n'hérite pas de `IBullet`: un ennemi le lance contre les tours et il désactive la tour touchée.

- `init(direction: Vector2, disable_duration: float = 3.0)`: fixe la direction et la durée pendant laquelle la tour touchée reste désactivée (`ITower.TowerState.DISABLED`, sprite à 50 % d'opacité), puis la tour est réactivée.
- `speed: float` (export, 200 par défaut).
- Il se détruit au bout de `DESTROY_TIMEOUT` (5 s) s'il ne touche rien.

## Sprites

| Sprite | Fichier | Utilisé par |
|---|---|---|
| ![Flèche](/documentation/game/sprites/sprite-projectile-arrow.png) | `assets/gameplay/bullet/arrow.png` | `base_arrow`, `aoe_arrow`, `fire_arrow` et `piercing_arrow` |
| ![Projectile ennemi](/documentation/game/sprites/sprite-projectile-jedo.png) | `assets/gameplay/bullet/jedo.png` | `enemy_projectile` |

`smoke.png` et `trail.png` sont les textures des particules de `i_bullet` (fumée d'impact et traînée).

## Dépendances

- `ITower` (owner)
- `IEnemy` (cible touchée)
- `Global.paused`
- `SignalUtil`

## Bonnes pratiques

- Éviter les collisions multiples avec un flag d'impact (`_has_impacted`).
- Garder les scènes projectile très simples (VFX) et confier les chiffres à `StatsDB`.
