---
title: Levels, Metadatas and Maps
sidebar_position: 20
description: Description of level model
---

# ILevel, LevelMetadata et IMap

## Description

:::warning
L'architecture des levels et maps est à refaire.
:::

Le nœud **ILevel** est un élément de base utilisé pour créer et paramétrer les niveaux. 

C'est également lui qui contient les statistiques du joueur au cours d'une partie (vie, ressources).

## Créer un niveau "from scratch"

Dans l'ordre :

### Map

1. Godot > Scenes > New inherited scene... > `res://scenes/map/i_map.tscn`
2. Sauvegarder nouvelle map dans `res://scenes/map/maps/<nom_map>.tscn`
3. Dessiner map depuis la TileMapPlains
4. Ajouter autant de node `Path2D` que nécessaire au node `Paths` puis dessiner les chemins
5. Ajouter node `Wave` au node `Waves`
6. Pour chaque node `Wave` ajouter autant de node `EnemyGroup` que voulu et les configurer

### Level

1. Godot > Scenes > New inherited scene... > `res://scenes/level/i_level.tscn`
2. Sauvegarder nouvelle map dans `res://scenes/level/levels/<nom_level>.tscn`
3. Sélectionner le node `ILevel` nouvellement cree et configurer sa propriété `Map Scene`

### Metadata

1. Ajouter un bouton au menu de selection des niveaux `LevelsMenu`
2. Ajouter un node enfant `LevelMetadata`
3. Configurer le node avec un id, un nom et la reference de votre level

---

## Structure

![Example banner](/models/level.drawio.svg)
