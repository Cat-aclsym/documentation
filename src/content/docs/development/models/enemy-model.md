---
title: Ennemi (IEnemy)
description: Déplacement, dégâts, effets, états et stats d'un ennemi
sidebar:
  label: Ennemi
  order: 30
---

`IEnemy` est la classe de base des ennemis. Elle gère le déplacement sur un `Path2D`, la vie et les dégâts, les effets d'état (poison, stun, electrify, slow) et les signaux de mort. Un ennemi apparaît via une étape `SPAWN` ([Vagues](/documentation/development/models/wave-model/)), qui retrouve sa scène par `enemy_id` (`ene.01` charge `enemies/ene.01.tscn`).

## Diagramme de classes

```mermaid
classDiagram
    class IEnemy {
        <<CharacterBody2D>>
        +String enemy_id
        +EnemyType type
        +float health
        +float max_health
        +float speed
        +EnemyState state
        +bool is_stunned
        +signal die()
        +signal camera_effect(effect: String)
        +take_damage(damage: float, damage_type: DamageType, source: Variant)
        +follow_path(delta: float)
        +add_poison_effect(damage: float, total_execution: int, interval: float)
        +apply_electrify_effect(duration: float, slow_amount: float, tick_damage: float, tick_interval: float, source: Variant)
        +is_electrified() bool
        +stun(duration: float)
        +push_slow_visual()
        +pop_slow_visual()
        +push_inferno_visual()
        +pop_inferno_visual()
    }
    class EnemyType {
        <<enumeration>>
        BIG_DADDY
        DEFAULT
        FAT
        RAT
    }
    class EnemyState {
        <<enumeration>>
        DEAD
        FOLLOW_PATH
        PATH_FINISHED
    }
    class DamageType {
        <<enumeration>>
        DEFAULT
        POISON
        FIRE
        STUN
    }
    class EnemySpawner {
        +spawn_enemy(path: Path2D, enemy: IEnemy)$
    }
    class BigDaddy
    class SmallZombie
    class SplitterZombie

    IEnemy --> EnemyType
    IEnemy --> EnemyState
    IEnemy --> DamageType
    BigDaddy --|> IEnemy
    SmallZombie --|> IEnemy
    SplitterZombie --|> IEnemy
    EnemySpawner ..> IEnemy : spawn_enemy
    IEnemy ..> StatsDB : stats
    IEnemy ..> ILevel : coins et health
    IEnemy ..> ChallengeManager : notify_enemy_hit, notify_enemy_died
```

## Contrat public

### Signaux

- `die`
- `camera_effect(effect: String)`

### Propriétés clés

`enemy_id`, `type`, `health`, `max_health`, `speed`, `state` et `is_stunned` (types dans le diagramme).

### Méthodes publiques

- `take_damage(damage: float, damage_type: DamageType, source: Variant = null)`
- `follow_path(delta: float)`
- `add_poison_effect(damage: float, total_execution: int, interval: float)`
- `apply_electrify_effect(duration: float, slow_amount: float, tick_damage: float, tick_interval: float, source: Variant = null)`
- `is_electrified() -> bool`
- `stun(duration: float)`

## États

- `FOLLOW_PATH`: ennemi en mouvement
- `DEAD`: ennemi mort (récompenses et cleanup)
- `PATH_FINISHED`: ennemi arrive à la fin du chemin

## Source des stats

Les stats runtime viennent de `assets/resources/configs/stats.json` via `StatsDB` ([Statistiques](/documentation/development/models/stats-model/)). Champs: `max_health`, `speed`, `reward`, `scene` et `extra` (optionnel, comportement spécifique).

Au `_ready()`, `IEnemy` lit l'entrée dont la clé est son export `enemy_id` et applique `max_health` et `speed` (une erreur est loguée si la clé manque). `reward` n'est lu que par l'[encyclopédie](/documentation/development/guides/ui/#encyclopédie).

Deux identifiants coexistent: l'`enemy_id` d'une étape de vague est le nom du fichier de scène (`ene.01`), l'export `enemy_id` de la scène est la clé de `stats.json` (`default_zombie`).

## Catalogue

Scènes de `scenes/gameplay/entities/enemy/enemies/`, toutes héritées de `i_enemy.tscn`:

| Clé `stats.json` | Scène | Vie | Vitesse | `reward` | Particularité |
|---|---|---|---|---|---|
| `default_zombie` | `ene.01` | 50 | 35 | 20 | Ennemi de base |
| `damage_zombie` | `ene.02` | 120 | 20 | 40 | |
| `rat` | `ene.03` | 25 | 70 | 5 | `type = RAT` |
| `splitter_zombie` | `splitter_zombie` | 150 | 35 | 5 | `SplitterZombie`: à sa mort, fait apparaître `extra.spawn_count` (4) petits zombies près de sa position sur le chemin |
| `small_zombie` | `small_zombie` | 25 | 70 | 10 | `SmallZombie`: échelle 0,6, apparaît avec une animation |
| `minesweeper` | `minesweeper` | 70 | 45 | 12 | Scène héritée de `ene.02`, teintée en vert, sans script |
| `big_daddy` | `big_daddy` | 700 | 20 | 400 | `BigDaddy`, `type = BIG_DADDY`: tire sur les tours à portée et les désactive ([Projectile](/documentation/development/models/projectile-model/)). `extra`: `shoot_range`, `fire_rate`, `tower_disable_duration`, `pre_attack_delay`, `attack_duration`, `post_attack_delay`, `attack_cooldown` |

Les types `FAT` et `BIG_DADDY` secouent la caméra à l'apparition et vident la vie de la base à l'arrivée. Aucune scène du projet n'utilise `FAT`.

## Mort et arrivée

- À sa mort, un ennemi rapporte 10 pièces, multipliées par le `reward_multiplier` de la tour qui a tiré le projectile fatal. Ce montant est écrit en dur dans `_dead_state()`: le champ `reward` de `stats.json` ne le change pas.
- À la fin du chemin, la base perd 5 points de vie. Pour `BIG_DADDY` et `FAT`, la vie tombe à 0.

## EnemySpawner

`EnemySpawner.spawn_enemy(path, enemy)` est une méthode statique appelée par `WaveStepSpawn.exec()`:

1. Crée un `PathFollow2D` (sans boucle ni rotation) sous le `Path2D`, avec un décalage latéral aléatoire d'au plus 0,2 tuile.
2. Nomme l'ennemi `ENEMY_<n>` et lui donne son `path` et son `path_follow`.
3. Connecte son signal `die` à `ILevel._on_enemy_die` et compte l'ennemi vivant (`_on_enemy_spawn()`).
4. Ajoute l'ennemi au `PathFollow2D`.

Un ennemi ajouté à la main doit passer par cette méthode pour être compté dans la vague. Pour créer un ennemi, voir [Recettes](/documentation/development/guides/recipes/#ajouter-un-ennemi).

## Dépendances

`StatsDB`, `ChallengeManager`, `Global`, `ILevel`.
