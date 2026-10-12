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
    "name": "Piège ralentissant",
    "scene": "res://scenes/gameplay/entities/trap/traps/bat_04.tscn"
  }
}
```

- `name`: libellé UI
- `scene`: scène instanciée
- `base`: `cost`, `trap_type` (0 = `PASSIVE`, 1 = `LIMITED`), `effect_duration` et `max_durability` (lus par `ITrap`), plus les clés propres à chaque piège (`slow_amount`, `damage`, `explosion_range`...)

`apply_stats_from_db()` copie ces valeurs dans le piège quand `trap_id` est renseigné. Une sous-classe lit ses clés supplémentaires en surchargeant `_apply_trap_stats_extension(base: Dictionary)`.

## ITrap

`ITrap` hérite de `IBuilding`, qui porte `cost` et `BuildingKind` (`TOWER`, `TRAP`). Propriétés exportées:

- `trap_type: TrapType`: `PASSIVE` (effet continu tant que l'ennemi est sur le piège) ou `LIMITED` (effet déclenché par ennemi jusqu'à épuisement de la durabilité)
- `effect_duration: float`: durée de l'effet par ennemi (type `LIMITED`)
- `max_durability: int`: durabilité maximale (type `LIMITED`)
- `trap_id: String`: clé sous `traps` dans `stats.json`

`state: TrapState` vaut `BUILDING` pendant la pose puis `ACTIVE`.

Méthodes à surcharger ou à utiliser:

- `apply_effect(enemy: IEnemy)`
- `remove_effect(enemy: IEnemy)`
- `disable_temporarily(duration: float)`: suspend le piège. Un ennemi `minesweeper` qui entre dans la zone désactive le piège pendant `MINESWEEPER_DISABLE_DURATION_SECONDS` (5 s).

## Progression

`TrapData` porte `unlocked: bool`, `save() -> Dictionary` et `from_dictionary(d: Dictionary)`. `ProgressionManager.is_trap_unlocked(trap_id)` contrôle l'accès.

## Dépendances

- `StatsDB`: définitions runtime
- `ProgressionManager`: unlock et persistance
- `ArmoryManager`: déblocage des pièges depuis l'armurerie

Garder `trap_id` identique entre `stats.json`, l'armurerie et la sauvegarde.
