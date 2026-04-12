---
title: Armory Model
sidebar_position: 80
description: Modèle de progression méta par étoiles (nodes, prérequis, effets)
---

# Armory

## Description

L'armurerie est un modèle de méta-progression basé sur les étoiles gagnées via les challenges.

Elle combine:

- un graphe de nœuds à acheter (`nodes`)
- des contraintes de prérequis (`prerequisites`)
- des effets appliqués au jeu (`effects`)
- des verrous d'upgrade (`upgrade_gates`)

La source de vérité est `res://resources/armory/armory.json`.

## Structure JSON

### Node

```json
{
  "id": "unlock_bat_02",
  "cost_stars": 1,
  "prerequisites": [],
  "category": "periphery_building",
  "effects": [{ "type": "unlock_tower", "tower_id": "bat_02" }]
}
```

### Upgrade gate

```json
{
  "upgrade_id": "bat_02_a_04",
  "requires_node": "unlock_bat_02_branch_a"
}
```

## Effets supportés

- `unlock_tower`
- `unlock_trap`

Ces effets mettent à jour la progression via `ProgressionManager`.

## Persistance

L'état joueur est stocké dans `ProgressionData`:

- `armory_purchased: Array[String]` (ids de nœuds achetés)
- `armory_legacy_mode: bool`

## Contraintes métier

- Un nœud ne peut être acheté que si tous ses prérequis sont validés.
- Le joueur doit avoir assez d'étoiles (`cost_stars`).
- Les upgrades verrouillées doivent vérifier la gate avant d'être proposées.

## Bonnes pratiques

- Garder les ids stables (utilisés par la sauvegarde).
- Éviter de renommer un `id` sans migration.
- Ajouter toute nouvelle catégorie ou tout nouvel effet avec un fallback explicite dans le code.
