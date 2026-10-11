---
title: Wave and WaveStep Models
description: Modèle des vagues et étapes (spawn/wait)
sidebar:
  order: 60
---

## Description

Le système de vague est composé de deux modèles:

- `Wave`: encapsule une liste d'étapes (`Array[WaveStep]`)
- `WaveStep`: classe de base d'une étape (spawn, wait, etc.)

Le niveau (`ILevel`) dépile les étapes une par une jusqu'à la fin de la vague, puis passe à la suivante.

## Contrat public

### Wave

- `steps: Array[WaveStep]`
- `_init(data: Array)`: construit les étapes depuis le JSON.
- `peak() -> WaveStep`: lit la prochaine étape sans la retirer.
- `pop() -> WaveStep`: retire et renvoie la prochaine étape.

### WaveStep

- `enum Order { UNDEFINED, COMMAND, SPAWN, WAIT, DIALOG }`
- `build(in_data: Dictionary) -> WaveStep`: fabrique `WaveStepSpawn` ou `WaveStepWait`.
- `data() -> Dictionary`: donne accès aux données brutes de l'étape.
- `exec()`: exécute la logique de l'étape.
- `is_over() -> bool`: indique si l'étape est terminée.
- `order() -> WaveStep.Order`: renvoie le type d'étape.

## Types d'étapes supportés

### Spawn

Format:

```json
{
  "enemy_id": "ene.01",
  "count": 5,
  "spawner": 0
}
```

Execution:

- charge la scène ennemi si nécessaire
- instantie un ennemi
- le place sur le path correspondant au spawner
- décrémente `count`

Fin d'étape: `count == 0`.

### Wait

Format:

```json
{
  "wait_s": 3
}
```

Execution:

- mémorise un `start` lors du premier `exec()`
- attend que le temps écoulé soit `>= wait_s`

## Exemple niveau

```json
{
  "waves": [
    [
      { "wait_s": 1 },
      { "enemy_id": "ene.01", "count": 5, "spawner": 0 }
    ]
  ]
}
```

## Dépendances

- `ILevel` (pilotage des étapes et transitions)
- `EnemySpawner`
- `ScenesLoader`
- `ProgressionManager` (marquage des ennemis vus)

## Extension recommandée

Pour ajouter un nouveau type d'étape:

1. Créer une classe dérivée de `WaveStep`
2. Étendre la détection dans `WaveStep.build(...)`
3. Ajouter la grammaire JSON correspondante
4. Ajouter des exemples de niveau et tests manuels en jeu
