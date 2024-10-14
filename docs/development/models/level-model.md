---
title: Levels, Metadatas and Maps
sidebar_position: 20
description: Description of level model
---

# ILevel, LevelMetadata et IMap

## Description

:::warning[This API sucks]
L'architecture des levels et maps est completement merdique.

Une refonte est à prevoire, en attendant il faudra faire avec...
:::

Le nœud **ILevel** est un élément de base utilisé pour creer et parametrer les niveaux. 

C'est egalement lui qui contient les statistiques du joueur au cours d'une partie (vie, ressources).

## Creer un niveau "from scratch"

Dans l'ordre :

### Map
1. Godot > Scenes > New inherited scene... > `res://scenes/map/i_map.tscn`
2. Sauvegarder nouvelle map dans `res://scenes/map/maps/<nom_map>.tscn`
3. Dessiner map depuis la TileMapPlains
4. Ajouter autant de node `Path2D` que necessaire au node `Paths` puis dessiner les chemins
5. Ajouter node `Wave` au node `Waves`
6. Pour chaque node `Wave` ajouter autant de node `EnemyGroup` que voulu et les configurer

### Level
1. Godot > Scenes > New inherited scene... > `res://scenes/level/i_level.tscn`
2. Sauvegarder nouvelle map dans `res://scenes/level/levels/<nom_level>.tscn`
3. Selectionner le node `ILevel` nouvellement cree et configurer sa propriete `Map Scene`

### Metadata
1. Ajouter un bouton au menu de selection des niveaux `LevelsMenu`
2. Ajouter un node enfant `LevelMetadata`
3. Configurer le node avec un id, un nom et la reference de votre level

---

## Structure

![Example banner](/assets/level_model.svg)

## Voir aussi

- [suicide-ecoute.fr](https://www.suicide-ecoute.fr/)