---
title: Architecture et patterns
description: Singletons, signaux et factories utilisés dans le code de Cat'aclysm
sidebar:
  label: Architecture
  order: 3
---

Le projet repose sur trois patterns récurrents: les autoloads (singleton), les signaux (observer) et les factories.

## Singleton

Les autoloads de `project.godot` sont accessibles partout par leur nom:

| Autoload | Rôle |
|---|---|
| `Global` | Références vers la caméra, l'UI, la console et le curseur |
| `SoundManager` | Lecture audio et volumes |
| `ScenesLoader` | Transitions entre scènes |
| `Dialogic` | Système de dialogues (addon) |
| `ProgressionManager` | Sauvegarde et progression du joueur |
| `StatsDB` | Statistiques des tours, pièges et ennemis (voir [Stats](/documentation/development/models/stats-model/)) |
| `ChallengeManager` | Suivi des challenges |
| `ArmoryManager` | Armurerie et achats par étoiles |
| `FirebaseTestLab` | Intégration Firebase Test Lab |

Le niveau en cours est accessible par la variable statique `ILevel.current_level`.

## Observer

Les composants communiquent par signaux Godot, connectés avec `SignalUtil.connects` (`scripts/utilities/signals/signal_util.gd`):

```gdscript
SignalUtil.connects([
	{SignalUtil.WHO: enemy, SignalUtil.WHAT: "die", SignalUtil.TO: _on_enemy_die},
])
```

Exemples de signaux:

- `IEnemy`: `die`, `camera_effect(effect: String)`
- `ILevel`: `stats_updated`, `wave_started(wave_number: int)`
- `ChallengeManager`: `challenge_status_updated(challenge_id, is_completed, is_failed)`

## Factory

- `WaveStep.build(data)` retourne un `WaveStepSpawn` ou un `WaveStepWait` selon les clés du JSON du niveau.
- `StateFactory.create(state_id, callback)` et `TransitionFactory.create(from, to, callback)` produisent les états et transitions d'une `StateMachine`.
- `StateMachineBuilder` assemble une `StateMachine` complète avec `build_state`, `build_initial_state` et `build_transition`.
