---
title: Projectile (IBullet)
description: Propriétés et sous-classes des projectiles de tour, et projectile ennemi qui désactive une tour
sidebar:
  label: Projectile
  order: 50
---

`IBullet` est la classe de base des projectiles de tour. Les scènes ne portent que les effets visuels: dégâts, vitesse et effets sont écrits sur le projectile à l'instanciation par la tour (`ITower._apply_projectile_config()`, à partir de `bullet_stats`).

## Contrat public

### Propriétés clés

- `damage: float`
- `initial_damage: float` (dégâts de départ, pour calculer les réductions en pourcentage)
- `speed: int`
- `trail_enabled: bool` (active la traînée configurée dans la scène)
- `direction: Vector2`
- `target: Vector2`
- `enemy_target: IEnemy`: l'ennemi visé quand la tour a tiré, que le faisceau et la foudre suivent ou frappent directement. La tour l'écrit à chaque tir.
- `tower_owner: ITower`: la tour qui a tiré. C'est elle qui est la source des dégâts, y compris ceux qui tombent après la disparition du projectile (brûlure, ticks d'électrisation), pour que la récompense et les défis la créditent.

### Cycle de vie

1. Spawn par la tour.
2. Déplacement en `_physics_process` (arrêté pendant une pause, `Global.paused`).
3. Détection de collision (`body_entered`).
4. Application des dégâts à `IEnemy`.
5. Nettoyage (désactivation, smoke, trail detach, free).

## Sous-classes

Scènes et scripts dans `scenes/gameplay/entities/bullet/`. Les constantes de gameplay propres à un projectile sont dans la section `bullets` de `stats.json` ([Statistiques](/documentation/development/models/stats-model/)), lues avec `StatsDB.get_bullet(id)`:

| Projectile | Scène | Comportement | Stats |
|---|---|---|---|
| `AOEArrow` | `aoe_arrow` | Explosion à l'impact: l'ennemi touché prend `damage`, les autres de la zone `aoe_range` prennent `damage` x `aoe_damage_multiplier` | `bullets.aoe_arrow.aoe_damage_multiplier` (0,75) |
| `FireArrow` | `fire_arrow` (hérite de `AOEArrow`) | Laisse une zone en feu pendant `burn_duration` s. À chaque tick, chaque ennemi dedans prend `burn_damage_base` + `damage` x `burn_damage_multiplier` (dégâts `FIRE`, source = la tour) | `bullets.fire_arrow`: `base_burn_damage` (5, repli quand la tour n'en fournit pas), `burn_damage_multiplier` (0,5), `burn_tick_time` (1 s) |
| `PiercingArrow` | `piercing_arrow` | Traverse `pierce_count` ennemis, avec `pierce_reduction` % de dégâts en moins par ennemi traversé | `bullet_stats` de la tour |
| `InstantLightning` | `instant_lightning` | Foudre instantanée sur la cible, rebonds (`chain_bounces`, `chain_range`, `chain_damage_falloff`) et électrisation (`electrify_duration`, `electrify_slow_amount`, `electrify_tick_damage`, `electrify_tick_interval`). L'électrisation a pour source la tour, pas la foudre, car celle-ci a disparu quand les ticks tuent. Les rebonds ne choisissent que des ennemis vivants du même chemin (un ennemi en train de mourir est ignoré) et ne frappent plus pendant une pause (`Global.paused`) | `bullet_stats` de la tour |
| `InfernoBeam` | `inferno_beam` | Faisceau continu sur une cible. Avec `is_charging`, les dégâts doublent chaque seconde de verrouillage (`charge_speed`), plafonnés par `max_damage_multiplier` (x8) | `bullet_stats` de la tour |

La brûlure est un état du `FireArrow`, pas de l'ennemi. Les dégâts de brûlure sont de type `FIRE`, ce qui compte pour le défi `cha.004` ([Défis](/documentation/development/models/challenge-model/)).

## EnemyProjectile

`EnemyProjectile` (`enemy_projectile`) est un `Area2D` indépendant, qui n'hérite pas de `IBullet`: Big Daddy le lance contre les tours.

- `init(direction: Vector2, disable_duration: float = 3.0, p_visual_only: bool = false, p_lifetime: float = 0.0)`: fixe la direction, la durée pendant laquelle la tour touchée reste désactivée (`ITower.disable_tower_for(disable_duration)`, sprite à 50 % d'opacité) et le mode. Un projectile visuel (`is_visual_only`) n'a pas de collision (`monitoring` désactivé) et ne fait que voler pendant `p_lifetime` secondes: c'est le flux visuel de Big Daddy, un seul projectile par attaque touche pour de bon ([Ennemi](/documentation/development/models/enemy-model/#big-daddy)).
- `speed: float` (export, 200 par défaut).
- Un projectile qui ne touche rien se détruit au bout de `DESTROY_TIMEOUT` (5 s).
- Il ne bouge pas pendant une pause (`Global.paused`).

## Sprites

| Sprite | Fichier | Utilisé par |
|---|---|---|
| ![Flèche](/documentation/game/sprites/sprite-projectile-arrow.png) | `assets/gameplay/bullet/arrow.png` | `base_arrow`, `aoe_arrow`, `fire_arrow` et `piercing_arrow` |
| ![Projectile ennemi](/documentation/game/sprites/sprite-projectile-jedo.png) | `assets/gameplay/bullet/jedo.png` | `enemy_projectile` |

`smoke.png` et `trail.png` sont les textures des particules de `i_bullet` (fumée d'impact et traînée).

## Dépendances

- `ITower` (owner)
- `IEnemy` (cible touchée)
- `StatsDB` (`get_bullet`)
- `Global.paused`
- `SignalUtil`

## Bonnes pratiques

- Éviter les collisions multiples avec un flag d'impact (`_has_impacted`).
- Garder les scènes projectile très simples (VFX) et confier les chiffres à `StatsDB`.
- Passer la tour comme source de dégâts différés (`tower_owner`), jamais le projectile.
