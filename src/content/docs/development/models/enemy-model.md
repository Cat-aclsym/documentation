---
title: Enemy Model
description: Modèle ennemi (déplacement, dégâts, effets, états)
sidebar:
  order: 10
---

## Description

`IEnemy` est la classe de base des ennemis de jeu.

Responsabilités principales:

- déplacement sur un `Path2D`
- gestion de vie et dégâts
- gestion des effets d'état (poison, stun, electrify, slow)
- émission de signaux de mort pour la progression et le gameplay

## Contrat public

### Signaux

- `die`
- `camera_effect(effect: String)`

### Propriétés clés

- `enemy_id: String`
- `type: EnemyType`
- `health: float`
- `max_health: float`
- `speed: float`
- `state: EnemyState`
- `is_stunned: bool`

### Enums

- `EnemyType`: `BIG_DADDY`, `DEFAULT`, `FAT`, `RAT`
- `DamageType`: `DEFAULT`, `POISON`, `FIRE`, `STUN`

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

Les stats runtime sont chargées depuis `assets/resources/configs/stats.json` via `StatsDB`.

Champs fréquents:

- `max_health`
- `speed`
- `reward`
- `scene`
- `extra` (optionnel, comportement spécifique)

## Dépendances

- `StatsDB`
- `ChallengeManager`
- `Global`
- `ILevel`
