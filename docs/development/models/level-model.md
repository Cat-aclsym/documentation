---
title: Levels, Metadatas and Maps
sidebar_position: 20
description: Modèle de niveau (ILevel), map et vagues
---

# ILevel, LevelMetadata et IMap

## Description

Le nœud **ILevel** est un élément de base utilisé pour créer et paramétrer les niveaux.

C'est également lui qui contient les statistiques du joueur au cours d'une partie (vie, ressources).

Les niveaux sont composés de **vagues**, elles-mêmes composées d'**étapes**.

**ILevel** utilise le nœud **Clock** afin d'exécuter son code métier à intervalle régulier, par défaut tous les **5 ticks** (*10 ticks = 1 seconde*).

Pour l'instant, les seules étapes disponibles sont `SPAWN` et `WAIT`. L'architecture permet d'en ajouter facilement de nouvelles, voir la classe **WaveStep**.

## Créer un niveau "from scratch"

Dans l'ordre :

### Map

1. Godot > Scenes > New inherited scene... > `res://scenes/map/i_map.tscn`
2. Sauvegarder la nouvelle map dans `res://scenes/map/maps/<nom_map>.tscn`
3. Dessiner la map depuis la TileMapPlains
4. Ajouter autant de node `Path2D` que nécessaire au node `Paths` puis dessiner les chemins

### Level

1. Godot > Scenes > New inherited scene... > `res://scenes/level/i_level.tscn`
2. Sauvegarder le niveau dans `res://scenes/level/levels/`. Le nom du fichier doit être `<level_id>.tscn`
3. Sélectionner le node `ILevel` nouvellement créé et configurer ses propriétés.

### Waves

1. Créer un fichier `res://resources/levels/<level_id>.json`
2. Remplir le fichier selon les standards suivants :

- **base**:
```json
{
    "waves": [
        // waves
    ]
}
```

- **vagues**:
```json
{
    "waves": [
        [
            // steps
        ],
    ]
}
```

- **step**:
```json
{
    "waves": [
        [
            {
                "enemy_id": "ene.01",
                "count": 1,
                "spawner": 1
            },
            {
                "wait_s": 5.25
            }
        ]
    ]
}
```

> Ici, le niveau contient une seule vague composée de deux étapes : faire apparaître 1 ennemi `ene.01` sur le spawner 1, puis attendre 5.25 secondes.

> Exemples complets dans le projet godot

## Voir aussi

- `Wave and WaveStep Models`
- `Challenge Model`
