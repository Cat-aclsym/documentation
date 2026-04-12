---
title: Trap Model
sidebar_position: 90
description: Modèle des pièges (stats runtime + progression d'unlock)
---

# Trap

## Description

Le modèle de piège se compose de deux couches:

- couche runtime: définition de stats gameplay dans `stats.json`
- couche progression: état d'unlock dans `TrapData`

## Contrat runtime (stats)

Dans `assets/resources/configs/stats.json`, chaque piège expose:

```json
{
  "bat_04": {
    "base": {
      "cost": 50,
      "slow_amount": 0.3,
      "trap_type": 0
    },
    "name": "Piege ralentissant",
    "scene": "res://scenes/gameplay/entities/trap/traps/bat_04.tscn"
  }
}
```

Champs principaux:

- `name`: libellé UI
- `scene`: scène instanciée
- `base`: stats de base (cost + stats spécifiques selon le type)

## Contrat progression (save)

`TrapData`:

- `unlocked: bool`
- `save() -> Dictionary`
- `from_dictionary(d: Dictionary) -> void`

`ProgressionManager` contrôle l'accès via `is_trap_unlocked(trap_id)`.

## Dépendances

- `StatsDB` pour charger les définitions runtime
- `ProgressionManager` pour unlock / persistance
- `ArmoryManager` / armory nodes pour débloquer les pièges méta

## Bonnes pratiques

- Garder `trap_id` identique entre `stats.json`, armurerie et sauvegarde.
- Ajouter des valeurs par défaut côté code si une stat optionnelle manque.
- Documenter tout nouveau champ `base` dans cette page.
