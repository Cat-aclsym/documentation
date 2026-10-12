---
title: Tour (ITower)
description: Ciblage, tir, états, calcul des stats et upgrades d'une tour
sidebar:
  label: Tour
  order: 40
---

`ITower` est le modèle runtime d'une tour. Elle hérite de `IBuilding`, la classe de base des éléments posés via `BuildPlacement` (tours et pièges). Elle gère la détection des ennemis en portée, le ciblage, le tir des projectiles ([Projectile](/documentation/development/models/projectile-model/)) et l'application des upgrades.

## Contrat public

### Signaux

`ITower` n'émet aucun signal propre. Ses connexions se font dans `ITower.signals`, un tableau passé à `SignalUtil.connects` dans `_ready()`: `area_entered`, `body_entered` et `body_exited` de la zone de portée (`Area2D`), `mouse_entered` et `mouse_exited` de la zone de survol (`TowerHoverBox`) et `pressed` du bouton. Les scènes `bat_XX.tscn` ne déclarent aucune connexion. Les deux signaux de survol vont vers `_on_hover_changed(hovered: bool)` (liés avec `bind(true)` et `bind(false)`), qui affiche ou masque la portée sauf en pause ou menu ouvert.

### Constantes

- `RANGE_COLOR: Color` (`Color.WHITE`): couleur du polygone et du contour de portée.
- `MODIFIER_STATS` et `PROJECTILE_GAMEPLAY_KEYS`: voir [Calcul des stats](#calcul-des-stats).

L'identité d'une tour est son `tower_id`, et `IBuilding.BuildingKind` (`TOWER`, `TRAP`) distingue tours et pièges. `IBuilding` est `@abstract` avec `get_building_kind()` abstraite, implémentée par `ITower` et `ITrap`.

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
- `reward_multiplier: float` (1 par défaut, multiplie la récompense des ennemis tués)
- `bullet_stats: Dictionary`
- `available_upgrade_ids: Array[String]`

### Méthodes publiques

- `apply_stats_from_db()`
- `fire()`
- `start_upgrade(upgrade_id)`
- `apply_upgrade()`
- `apply_special_modifier(modifiers: Dictionary)`: pose les multiplicateurs d'une case spéciale (un dictionnaire vide les retire) puis recalcule les stats.
- `sell_tower()`
- `disable_tower()` et `enable_tower()`: arrêtent et relancent le tir (état `DISABLED`).
- `disable_tower_for(duration: float)`: désactive la tour pendant `duration` secondes, sprite à 50 % d'opacité, puis la réactive. C'est ce qu'appelle un `EnemyProjectile` de Big Daddy.
- `show_range(p_show: bool, smooth: bool = true)`
- `get_display_bullet_stats() -> Dictionary`

Une tour ne tire pas et ne réagit pas aux clics pendant une pause (`Global.paused`).

## Calcul des stats

`ITower._recompute_stats()` reconstruit toutes les stats depuis zéro, dans cet ordre:

1. Les stats de base de `stats.json` (`apply_stats_from_db()`), puis les bonus de l'armurerie (`ArmoryManager.apply_buffs_to_tower`).
2. Chaque upgrade appliquée, dans l'ordre (`_applied_upgrade_ids`): les deltas de `tower_stats` si `changes.tower_stat`, ceux de `bullet_stats` si `changes.bullet_stat`, et la scène de projectile de `bullet_scene_path` si `changes.bullet_model`.
3. Les modificateurs de la case sur laquelle se trouve la tour: `fire_rate`, `shoot_range` et `reward_multiplier` sont multipliés, et `bullet_stats.damage` aussi pour `damage`.

Il est appelé à chaque `apply_upgrade()` et à chaque `apply_special_modifier()`. Une case bonus ou malus et une upgrade ne s'écrasent donc pas: la case est réappliquée par-dessus les upgrades. Les modificateurs acceptés sont ceux de `ITower.MODIFIER_STATS` (`damage`, `fire_rate`, `reward_multiplier`, `shoot_range`), lus dans `tile_modifiers` de `stats.json` ([Statistiques](/documentation/development/models/stats-model/)).

Au tir, `_apply_projectile_config()` copie sur le projectile les clés de `bullet_stats` listées dans `PROJECTILE_GAMEPLAY_KEYS` (`damage`, `speed`, `pierce_count`, `aoe_range`, `burn_damage_base`, `electrify_*`, `chain_*`, `is_charging`, `max_damage_multiplier`...). Les scènes de projectile ne portent que les effets visuels.

## Catalogue

Stats de base de `stats.json` (niveau 1), scènes dans `scenes/gameplay/entities/tower/towers/`. Les noms viennent des clés `TOWER.<ID>.NAME`:

| Sprite | Clé | Nom | Coût | Cadence (`fire_rate`) | Portée | Dégâts |
|---|---|---|---|---|---|---|
| ![Sprite de l'Arbre à chat'rché](/documentation/game/sprites/sprite-tower-bat-01.png) | `bat_01` | Arbre à Chat'rchés | 50 | 1 | 75 | 25 |
| ![Sprite de la Tour Cataboom](/documentation/game/sprites/sprite-tower-bat-02.png) | `bat_02` | Tour Cataboom | 100 | 0,5 | 60 | 20 (`aoe_range` 15) |
| ![Sprite de la Tour Tesla](/documentation/game/sprites/sprite-tower-bat-08.png) | `bat_08` | Tour Tesla | 150 | 5 | 55 | 5 |
| ![Sprite de la Tour Inferno, teintée en rouge](/documentation/game/sprites/sprite-tower-bat-09.png) | `bat_09` | Tour de l'enfer | 200 | 10 | 100 | 0,5 |

Chaque sprite est la première image de l'animation `idle` de la scène. `bat_09` réutilise la feuille de `bat_01` teintée en rouge.

## Tour Inferno

`InfernoTower` (`inferno_tower.gd`, `bat_09`) tire un faisceau continu (`InfernoBeam`) par cible: avec `projectile_count > 1` (upgrade `bat_09_b_04`, 4), elle garde un faisceau sur chacune des premières cibles à portée. Pour une cible qu'un faisceau brûle déjà, la tour n'instancie pas de nouveau faisceau (`_handle_custom_fire` relance seulement le timer de cadence). Les faisceaux sont libérés quand la tour est désactivée, et un faisceau n'inflige plus de dégâts pendant une pause, y compris celle de fin de niveau (`Global.paused`). L'upgrade `bat_09_a_04` fait « charger » le faisceau: les dégâts doublent chaque seconde de verrouillage sur la même cible (`charge_speed`), plafonnés par `max_damage_multiplier`, soit x8 dans `stats.json`.

## Upgrades de projectile

Les upgrades avec `changes.bullet_stat` ajoutent leurs valeurs à `bullet_stats` (un booléen est remplacé, pas additionné). Exemples: `bat_01_a_04` passe au `PiercingArrow`, `bat_02_a_04` au `FireArrow` (brûlure), `bat_08_b_04` ajoute l'électrisation (`electrify_*`) et `bat_08_a_04` les rebonds de la foudre (`chain_*`).

## Armurerie

Les achats de l'[armurerie](/documentation/development/models/armory-model/) modifient les tours:

- `ArmoryManager.apply_buffs_to_tower(tower)` applique les bonus de `tower_buff`.
- `ArmoryManager.append_unlocked_upgrade_ids(tower)` ajoute les upgrades débloquées à `available_upgrade_ids`.
- `ArmoryManager.filter_upgrade_ids(ids)` retire les upgrades dont la gate n'est pas achetée.

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
