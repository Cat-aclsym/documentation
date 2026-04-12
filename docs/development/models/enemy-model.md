---
title: Enemy Model
sidebar_position: 10
description: Modèle ennemi (déplacement, dégâts, effets, états)
---

# Enemy

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
- `health: float`
- `max_health: float`
- `speed: float`
- `state: EnemyState`

### Méthodes publiques

- `take_damage(damage, damage_type, source)`
- `follow_path(delta)`
- `add_poison_effect(damage, total_execution, interval)`
- `apply_electrify_effect(duration, slow_amount, tick_damage, tick_interval)`
- `stun(duration)`

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

---

## Structure

Diagramme à ajouter si besoin (draw.io), selon le template de `how-to.md`.
