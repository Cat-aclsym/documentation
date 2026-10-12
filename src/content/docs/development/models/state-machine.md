---
title: Machine d'états (StateMachine)
description: États, transitions et builder de la machine d'états qui pilote le déroulement d'un niveau
sidebar:
  label: Machine d'états
  order: 15
---

`StateMachine` (`scripts/state_machine/`) est une machine d'états à transitions explicites: passer d'un état à un autre exige une transition déclarée. Seul `ILevel` l'utilise, pour le déroulement des vagues. Les fabriques et le builder sont présentés dans [Architecture](/documentation/development/guides/architecture/#factory).

```mermaid
classDiagram
    class StateMachine {
        +String name
        +Dictionary states
        +signal state_changed(state: State)
        +toggle_state(state_id: String) bool
        +toggle_initial_state() bool
        +handle_current_state(args: Array) bool
        +get_current_state() State
        +add_state(state_id: String, new_state: State)
        +add_initial_state(state_id: String, new_state: State)
        +add_transition(new_transition: Transition)
    }
    class State {
        +String name
        +Callable callback
        +handle(args: Array) bool
    }
    class Transition {
        +State from
        +State to
        +Callable callback
        +handle()
    }
    class StateMachineBuilder {
        +build() StateMachine
        +build_state(state_id: String, state_callback: Callable) StateMachineBuilder
        +build_initial_state(state_id: String, state_callback: Callable) StateMachineBuilder
        +build_transition(tr_id_from: String, tr_id_to: String, new_callback: Callable) StateMachineBuilder
    }
    class StateFactory {
        +create(state_id: String, state_callback: Callable) State$
    }
    class TransitionFactory {
        +create(tr_from: State, tr_to: State, new_callback: Callable) Transition$
    }

    StateMachine *-- State : states
    StateMachine *-- Transition : valid_transition
    Transition --> State : from, to
    StateMachineBuilder ..> StateMachine : build
    StateMachineBuilder ..> StateFactory
    StateMachineBuilder ..> TransitionFactory
    StateFactory ..> State
    TransitionFactory ..> Transition
```

## Fonctionnement

- Un `State` porte un nom et un `Callable` qui reçoit un tableau d'arguments et renvoie un `bool`.
- `toggle_state(state_id)` cherche la transition de l'état courant vers l'état demandé. Si elle existe, l'état courant change, le callback de la transition s'exécute et `state_changed` est émis. Sinon la méthode loggue une erreur `ERROR` et renvoie `false`. Un identifiant inconnu donne le même résultat.
- `handle_current_state(args)` exécute le callback de l'état courant.
- `toggle_initial_state()` émet `state_changed` pour l'état initial, sans exécuter son callback.
- `add_state` et `add_transition` refusent les doublons (`assert`).

Le builder enchaîne les appels:

```gdscript
var builder := StateMachineBuilder.new()
builder.build_initial_state(STATE_CONFIGURING, _on_state_configuring)
builder.build_state(STATE_WAVE_0, _on_state_wave)
builder.build_transition(STATE_CONFIGURING, STATE_WAVE_0)
state_machine = builder.build()
```

Les deux états d'une transition doivent exister avant d'appeler `build_transition`.

## États d'un niveau

`ILevel._build_state_machine()` crée les états `CONFIGURING` (initial), `WAVE_<i>` (un par vague), `PAUSE`, `VICTORY`, `DEFEAT`, `ERROR` et `END`. Le `Clock` du niveau appelle `handle_current_state` toutes les 5 ticks, donc le callback de l'état courant s'exécute à chaque cycle.

```mermaid
stateDiagram-v2
    [*] --> CONFIGURING
    CONFIGURING --> WAVE_0
    WAVE_0 --> WAVE_1 : vague suivante
    WAVE_1 --> WAVE_n : vague suivante
    WAVE_n --> VICTORY : dernière vague terminée
    WAVE_1 --> PAUSE : depuis chaque vague
    PAUSE --> WAVE_1 : vers la vague courante
    WAVE_1 --> DEFEAT : vie à 0, depuis chaque vague
    VICTORY --> END
    DEFEAT --> END
```

`WAVE_n` est la dernière vague. Seule elle mène à `VICTORY`, et chaque vague mène uniquement à la suivante.

| État | Callback |
|---|---|
| `CONFIGURING` | Passe aussitôt à `WAVE_0` |
| `WAVE_<i>` | Exécute les étapes de la vague. Quand la vague est vide et qu'aucun ennemi n'est en vie, passe à la vague suivante ou à `VICTORY` |
| `PAUSE` | Met `Engine.time_scale` à 0 et `Global.paused` à `true` |
| `VICTORY` | Lance `ChallengeManager.check_victory_conditions()` puis la fin de niveau (écran de victoire) |
| `DEFEAT` | Fin de niveau (écran de défaite) |
| `ERROR` | Loggue une erreur |
| `END` | Sans callback |

Autres transitions déclarées, non montrées ci-dessus:

- `CONFIGURING` vers `DEFEAT` et `ERROR`.
- Chaque `WAVE_<i>` vers `CONFIGURING` et `ERROR`.
- `VICTORY` vers `CONFIGURING` et `ERROR`.
- `DEFEAT` vers `PAUSE` et `ERROR`.

`ILevel.pause()` bascule vers `PAUSE` et `resume_from_pause()` revient à `WAVE_<current_wave>` ([Niveau et carte](/documentation/development/models/level-model/)).

## Ajouter un état

1. Écrire le callback (`func _on_state_x(_args = []) -> bool`).
2. L'enregistrer avec `build_state`.
3. Déclarer chaque transition avec `build_transition`: une transition absente est refusée au `toggle_state`.
