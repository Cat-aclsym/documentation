---
title: Défis (Challenge)
description: Objectif optionnel d'un niveau, cycle de vie, notifications et définitions JSON
sidebar:
  label: Défis
  order: 80
---

`Challenge` représente un défi: un objectif optionnel attaché à un niveau. Cycle de vie: initialisation (`_init(p_id, p_title, p_desc, p_diff)`), début de monitoring (`start_monitoring`), puis échec ou complétion (`fail` / `complete`).

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

Autres membres du `ChallengeManager`:

- `challenge_status_updated(challenge_id, is_completed, is_failed)`: signal émis quand le statut d'un défi change.
- `challenges_loaded`: signal émis une fois les défis du niveau chargés.
- `get_active_challenges() -> Array[Challenge]`: défis actifs du niveau en cours.
- `emit_runtime_status()`: émet `challenge_status_updated` pour chaque défi actif.

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

Le champ `script` pointe vers la logique du défi. Les défis non implémentés (`cha.005`, `cha.106`, `cha.201`, `cha.203`, `cha.204`) utilisent `logics/impossible.gd` (`ChallengeImpossible`), qui échoue dès `start_monitoring()` et ne peut jamais être complété. Les 12 autres ont leur propre `cha.XXX.gd`.

## Dépendances

- `ChallengeManager`
- `ILevel.current_level`
- `ProgressionManager`
- Scripts de `res://scripts/challenges/logics/*.gd`

## Points de vigilance

- `complete()` et `fail()` sont sans effet si le défi est déjà complété ou échoué: un défi ne peut pas être les deux.
- Le script de logique doit rester idempotent sur les notifications de gameplay.
