---
title: Challenge Model
description: Modèle de challenge de niveau (condition, statut, complétion)
sidebar:
  order: 50
---

## Description

Le modèle `Challenge` représente un objectif optionnel attaché à un niveau.

Il expose un cycle de vie simple:

1. Initialisation (`id`, `title`, `description`, `difficulty`)
2. Début de monitoring (`start_monitoring`)
3. Échec ou complétion (`fail` / `complete`)

## Contrat public

### Propriétés clés

- `id: String`
- `title: String`
- `description: String`
- `difficulty: String`
- `is_completed: bool`
- `is_failed: bool`

### Signaux

- `completed(challenge_id: String)`
- `failed(challenge_id: String)`

### Méthodes publiques

- `start_monitoring()`: réinitialise l'état du challenge au démarrage du niveau.
- `check_completion() -> bool`: renvoie `true` si le challenge n'est pas en échec.
- `complete()`: marque comme complété et enregistre l'état via `ProgressionManager.complete_challenge(...)`.
- `fail()`: marque comme échoué.

## Notifications du ChallengeManager

Le `ChallengeManager` relaie les événements de jeu aux challenges actifs (via les méthodes `on_*` de leur script):

- `notify_damage(amount, source)`
- `notify_tower_placed(tower)`
- `notify_trap_placed(trap)`
- `notify_building_placed(building)`: redirige vers l'une des deux méthodes précédentes selon le type de bâtiment
- `notify_enemy_hit(enemy, source)`
- `notify_enemy_died(enemy, damage_type, source)`

Le signal `challenge_status_updated(challenge_id, is_completed, is_failed)` est émis quand le statut d'un challenge change.

## Flux d'exécution

- Au démarrage du niveau, `ChallengeManager.start_level_challenges(level_id)` initialise les challenges.
- Les scripts métier de challenges (ex: `cha.000.gd`) notifient les événements de jeu.
- En victoire, `ChallengeManager.check_victory_conditions()` lance la vérification de complétion.
- En cas de succès, le challenge est persisté dans `LevelData.challenges_completed`.

## Données JSON associées

Chaque challenge est décrit par un JSON dans `res://resources/challenges`:

```json
{
  "id": "cha.000",
  "name": "CHALLENGE.CHA.000.NAME",
  "description": "CHALLENGE.CHA.000.DESC",
  "difficulty": "Easy",
  "script": "res://scripts/challenges/logics/cha.000.gd"
}
```

## Dépendances

- `ChallengeManager`
- `ILevel.current_level`
- `ProgressionManager`
- Scripts métier de `res://scripts/challenges/logics/*.gd`

## Points de vigilance

- Un challenge ne peut pas être complété et échoué en même temps.
- Toujours protéger les appels de persistance avec les garde-fous (`is_completed` / `is_failed`).
- Le script logique doit rester idempotent sur les notifications de gameplay.
