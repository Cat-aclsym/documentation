---
title: Levels, Metadatas and Maps
sidebar_position: 20
description: Description of level model
---

# ILevel, LevelMetadata et IMap

## Description

Le nœud **ILevel** est un élément de base utilisé pour créer et paramétrer les niveaux. 

C'est également lui qui contient les statistiques du joueur au cours d'une partie (vie, ressources).

Les niveaux sont composés de **vagues**, elles meme composées d'**etapes**.

**ILevel** utilise le nœud **Clock** afin d'éxecuter son code metier à interval régulier, par defaut tous les **5 ticks** (*10 ticks = 1 seconds*).

Pour l'instant les seuls etapes disponibles sont SPAWN et WAIT. La nouvelle architecture permet d'en rajouter de nouvelles facilement, voir class **WaveStep**.

## Créer un niveau "from scratch"

Dans l'ordre :

### Map

1. Godot > Scenes > New inherited scene... > `res://scenes/map/i_map.tscn`
2. Sauvegarder nouvelle map dans `res://scenes/map/maps/<nom_map>.tscn`
3. Dessiner map depuis la TileMapPlains
4. Ajouter autant de node `Path2D` que nécessaire au node `Paths` puis dessiner les chemins

### Level

1. Godot > Scenes > New inherited scene... > `res://scenes/level/i_level.tscn`
2. Sauvegarder nouvelle map dans `res://scenes/level/levels/`. Le nom du fichier doit etre `<level_id>.tscn`
3. Sélectionner le node `ILevel` nouvellement cree et configurer ses proprietes.

### Waves

1. Creer un fichier `res://resources/levels/<level_id>.json`
2. Remplire le fichier selon les standards suivants :

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

> Ici nous avons un niveau composé d'une vague, elle meme composée de deux étapes : faire apparaitre 1 enemie `ene.01` sur le spawner 1, puis attendre 5.25 seconds.

> Exemples complets dans le projet godot

---

## Structure

![Example banner](/models/level.drawio.svg)
