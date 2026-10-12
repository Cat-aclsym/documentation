---
title: Piège (ITrap)
description: Stats runtime, comportement d'un piège et état d'unlock sauvegardé
sidebar:
  label: Piège
  order: 60
---

Le modèle de piège a deux couches: les stats gameplay de `stats.json` (runtime) et l'état d'unlock de `TrapData` (progression).

## Stats runtime

Dans `assets/resources/configs/stats.json`, chaque piège expose:

```json
{
  "bat_04": {
    "base": {
      "cost": 50,
      "slow_amount": 0.3,
      "trap_type": 0
    },
    "scene": "res://scenes/gameplay/entities/trap/traps/bat_04.tscn"
  }
}
```

- `scene`: scène instanciée
- `base`: `cost`, `trap_type` (0 = `PASSIVE`, 1 = `LIMITED`), `effect_duration` et `max_durability` (lus par `ITrap`), plus les clés propres à chaque piège (`slow_amount`, `damage`, `explosion_range`...)

Il n'y a pas de champ `name`: le libellé vient de la clé de traduction `TRAP.<ID>.NAME` (`StatsDB.name_key("TRAP", trap_id)`, par exemple `TRAP.BAT_04.NAME`).

`apply_stats_from_db()` applique `base` avec `StatsDB.apply_fields(self, base)` quand `trap_id` est renseigné: chaque clé écrit la propriété du même nom, convertie à son type. Une sous-classe n'a donc rien à surcharger: elle déclare une propriété par clé (`var slow_amount: float` pour `slow_amount`). Une clé sans propriété est ignorée avec un log `WARN` ([Statistiques](/documentation/development/models/stats-model/#api-statsdb)).

## Catalogue

Les cinq pièges partagent le sprite `spikes.png`, teinté par la scène (colonne Teinte):

| Sprite | Clé | Nom | Coût | `trap_type` | Teinte | Effet de base |
|---|---|---|---|---|---|---|
| ![Sprite du piège à lames](/documentation/game/sprites/sprite-trap-bat-03.png) | `bat_03` | Piège à lames | 10 | `LIMITED` | aucune | `damage` 10, puis immobilise l'ennemi qui survit pendant `effect_duration` (0,25 s) |
| ![Sprite du piège ralentissant, teinté en turquoise](/documentation/game/sprites/sprite-trap-bat-04.png) | `bat_04` | Piège ralentissant | 50 | `PASSIVE` | turquoise | `slow_amount` 0,3 |
| ![Sprite de la bombe, teintée en rouge](/documentation/game/sprites/sprite-trap-bat-05.png) | `bat_05` | Bombe | 25 | `LIMITED` | rouge | `damage` 50, `explosion_range` 100, `explosion_delay` 2 |
| ![Sprite du piège empoisonné, teinté en violet](/documentation/game/sprites/sprite-trap-bat-06.png) | `bat_06` | Piège empoisonné | 40 | `PASSIVE` | violet | `poison_damage` 5 pendant 6 ticks (`poison_ticks`), `poison_interval` 1 |
| ![Sprite du piège étourdissant, teinté en jaune](/documentation/game/sprites/sprite-trap-bat-07.png) | `bat_07` | Piège étourdissant | 30 | `LIMITED` | jaune | `charge_time` 2, `stun_duration` 4, `stun_range` 100 |

Les ralentissements passent par les modificateurs de vitesse nommés de l'ennemi ([Ennemi](/documentation/development/models/enemy-model/#modificateurs-de-vitesse)): `bat_03` utilise la clé `bat_03`, `bat_04` la clé `bat_04`.

## ITrap

`ITrap` hérite de `IBuilding`, qui porte `cost` et `BuildingKind` (`TOWER`, `TRAP`). Propriétés exportées:

- `trap_type: TrapType`: `PASSIVE` (effet continu tant que l'ennemi est sur le piège) ou `LIMITED` (effet déclenché par ennemi jusqu'à épuisement de la durabilité)
- `effect_duration: float`: durée de l'effet par ennemi (type `LIMITED`)
- `max_durability: int`: durabilité maximale (type `LIMITED`)
- `trap_id: String`: clé sous `traps` dans `stats.json`

`state: TrapState` vaut `BUILDING` pendant la pose puis `ACTIVE`.

Un piège détecte les ennemis par le chevauchement de son `Area2D` avec leur `FeetArea` (la zone des pieds, signaux `area_entered` et `area_exited`), jamais par le corps. Rien ne se déclenche pendant une pause (`Global.paused`): ni l'activation par un ennemi, ni l'explosion de la bombe ni le stun du piège étourdissant une fois leur délai écoulé.

Seuls les pièges `LIMITED` et l'aperçu de construction (`state = BUILDING`) ont un `_process` actif (`set_process` dans `_ready()` et `enter_build_preview()`): un piège `PASSIVE` posé ne coûte aucun appel par image.

### Durée de vie d'un piège limité

Un piège `LIMITED` perd 1 de durabilité à chaque ennemi déclenché (son opacité reflète la durabilité restante). Quand la durabilité tombe à 0, il n'est plus utilisable et se libère après `_get_post_trigger_lifetime()` (par défaut `effect_duration`) une fois les effets en cours terminés, pour que l'effet commencé se finisse. Les pièges à séquence (bombe, piège étourdissant) posent `is_activating` tant qu'ils jouent leur charge ou leur explosion, et se libèrent eux-mêmes. Un ennemi qui meurt ou arrive au bout du chemin pendant un effet le laisse s'épuiser sans lui.

Méthodes à surcharger ou à utiliser:

- `apply_effect(enemy: IEnemy)`
- `remove_effect(enemy: IEnemy)`
- `disable_temporarily(duration: float)`: suspend le piège (opacité réduite, effets retirés), puis le réactive et réapplique ses effets aux ennemis présents.

### Démineur

Un ennemi dont `trap_disable_duration` est supérieur à 0 (le `minesweeper`, `extra.trap_disable_duration` = 5 dans `stats.json`) ne déclenche pas le piège: il le désactive avec `disable_temporarily(enemy.trap_disable_duration)` quand il entre dans sa zone. La durée est mise en cache sur l'ennemi à son `_ready()`, `ITrap` n'interroge pas `StatsDB` à chaque chevauchement.

## Progression

`TrapData` porte `unlocked: bool`, `save() -> Dictionary` et `from_dictionary(d: Dictionary)`. `ProgressionManager.is_trap_unlocked(trap_id)` contrôle l'accès. Aucun piège n'est débloqué au départ (`ARMORY_STARTER_TRAP_IDS` est vide).

## Dépendances

- `StatsDB`: définitions runtime
- `ProgressionManager`: unlock et persistance
- `ArmoryManager`: déblocage des pièges depuis l'armurerie
- `ChallengeManager`: `notify_enemy_hit` pour un boss touché par un piège passif ([Défis](/documentation/development/models/challenge-model/))

Garder `trap_id` identique entre `stats.json`, l'armurerie et la sauvegarde.
