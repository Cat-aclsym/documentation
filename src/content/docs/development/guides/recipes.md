---
title: "Recettes : ajouter du contenu"
description: Les étapes et les fichiers à toucher pour ajouter un ennemi, une tour, un piège, un niveau, un défi ou une commande
sidebar:
  label: Recettes
  order: 5
---

Chaque recette liste les fichiers à créer ou à modifier. Les détails sont dans les pages liées.

## Conventions d'identifiants

| Contenu | Format | Exemple | Où |
|---|---|---|---|
| Tour ou piège | `bat_XX` | `bat_02`, `bat_03` | Clés de `stats.json`, `tower_id` et `trap_id` des scènes |
| Scène d'ennemi | `ene.XX` ou nom de fichier | `ene.01`, `small_zombie` | Fichiers de `enemies/`, clé `enemy_id` des vagues |
| Ennemi (stats) | `snake_case` | `default_zombie` | Clés de `stats.json`, export `enemy_id` de la scène |
| Niveau | `lev.XX` | `lev.01` | Scène, JSON, `level_id` |
| Arc | `arc.XX` | `arc.01` | `arc_id` des niveaux |
| Défi | `cha.XXX` | `cha.101` | JSON et logique de `challenges/` |
| Nœud d'armurerie | `unlock_<bat_XX>` | `unlock_bat_02` | `armory.json` |

## Ajouter un ennemi

1. Créer `scenes/gameplay/entities/enemy/enemies/<nom>.tscn`, une scène héritée de `i_enemy.tscn`. Renseigner l'export `enemy_id` (la clé `stats.json`) et, si besoin, `type`. Un comportement propre passe par un script qui étend `IEnemy` (`SmallZombie`, `SplitterZombie`, `BigDaddy`).
2. Ajouter `enemies.<enemy_id>` dans `assets/resources/configs/stats.json`: `max_health`, `speed`, `reward`, `scene` et `extra` si besoin.
3. Utiliser le nom du fichier comme `enemy_id` dans une étape de vague ([Vagues](/documentation/development/models/wave-model/)).
4. Ajouter `ENEMY.<ID>.NAME` au CSV et l'identifiant à la table de noms de `encyclopedia.gd` ([Traductions](/documentation/development/guides/i18n/), [Interface](/documentation/development/guides/ui/#encyclopédie)).

Voir [Ennemi](/documentation/development/models/enemy-model/).

## Ajouter une tour

1. Créer `scenes/gameplay/entities/tower/towers/bat_XX.tscn`, héritée de `i_tower.tscn`, avec `tower_id = "bat_XX"`.
2. Ajouter `towers.bat_XX` dans `stats.json` (`base`, `level`, `name`, `scene`, `upgrades`) et les `upgrades.<id>` référencés ([Statistiques](/documentation/development/models/stats-model/)).
3. Créer `build_card_bat_XX.tscn` dans `scenes/ui/menus/building_selection/building_cards/` avec son export `entity`, puis l'ajouter à `build_selection.tscn` ([Construction](/documentation/development/guides/building-placement/#menu-de-construction)).
4. Ajouter le nœud `unlock_bat_XX` dans `resources/armory/armory.json`, avec l'effet `unlock_tower`. Sans lui, la tour reste verrouillée, sauf si son id est dans `ARMORY_STARTER_TOWER_IDS` ([Armurerie](/documentation/development/models/armory-model/)).
5. Ajouter `TOWER.BAT_XX.NAME` au CSV si le nom doit être traduit.

Voir [Tour](/documentation/development/models/tower-model/).

## Ajouter un piège

Comme une tour, avec ces différences:

- Scène dans `scenes/gameplay/entities/trap/traps/bat_XX.tscn`, héritée de `i_trap.tscn`, avec `trap_id`.
- Entrée sous `traps.bat_XX` dans `stats.json` (`base` avec `cost`, `trap_type`, et selon le piège `damage`, `max_durability`, etc.).
- Effet d'armurerie `unlock_trap`.

Voir [Piège](/documentation/development/models/trap-model/).

## Ajouter un niveau

Scène de niveau, scène de carte, JSON de vagues et un `LevelFrame` dans le menu: voir [Créer un niveau](/documentation/development/guides/levels-and-arcs/#créer-un-niveau).

## Ajouter un défi

1. Créer `resources/challenges/cha.XXX.json` avec `id`, `name`, `description` (clés de traduction), `difficulty` (`Easy`, `Medium`, `Hard` ou `Impossible`) et `script`.
2. Créer la logique `scripts/challenges/logics/cha.XXX.gd`: une classe qui étend `Challenge` et implémente les méthodes `on_*` dont elle a besoin (`on_damage_taken`, `on_tower_placed`, `on_enemy_died`...).
3. Ajouter `CHALLENGE.CHA.XXX.NAME` et `CHALLENGE.CHA.XXX.DESC` au CSV.
4. Ajouter `cha.XXX` à la clé `challenges` du JSON des niveaux concernés.

```gdscript
class_name Challenge001
extends Challenge

func on_damage_taken(amount: int) -> void:
	if amount > 0:
		fail()
```

Un défi non implémenté pointe vers `logics/impossible.gd`. Voir [Défis](/documentation/development/models/challenge-model/).

## Ajouter une commande de console

Créer `scripts/commands/<nom>.gd` qui étend `ICommand`: le nom du fichier est le nom de la commande. Voir [Créer une commande](/documentation/development/guides/console-commands/).

## Où placer les fichiers

- Entité, menu ou widget avec une scène: `scenes/...`
- Service global: `scripts/autoloads/...`
- Niveau, arc, défi ou armurerie: `resources/...`
- Stats d'une tour, d'un piège ou d'un ennemi: `assets/resources/configs/stats.json`

L'arborescence complète est dans [Structure du projet](/documentation/development/guides/file-structure/).
