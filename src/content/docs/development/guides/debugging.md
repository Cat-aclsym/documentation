---
title: Outils de debug
description: Ce qui n'existe qu'en debug, les widgets de visualisation et les raccourcis pour tester un niveau
sidebar:
  label: Outils de debug
  order: 13
---

Les outils de debug dépendent tous de `Global.debug`, qui vaut `OS.has_feature("debug")`: `true` dans l'éditeur et dans un export debug, `false` dans un export release. La valeur ne peut pas être modifiée une fois le jeu initialisé.

| Outil | Comportement en release |
|---|---|
| [Console](/documentation/development/guides/console/) | La scène se supprime au démarrage |
| `Log.trace` au niveau `DEBUG` | Le message est ignoré ([Logs](/documentation/development/guides/logger/#niveaux)) |
| `Watcher` | Le nœud se libère dans `_ready()` |
| Bouton `debug: stats icons` du menu d'accueil | Reste masqué |

## Watcher

`Watcher` (`scenes/watcher/watcher.tscn`) est un `PanelContainer` qui affiche en continu la valeur d'une propriété d'un nœud. Il est marqué `@experimental` et aucune scène du projet n'en contient.

| Export | Rôle |
|---|---|
| `node: Node` | Nœud observé (obligatoire) |
| `property: StringName` | Propriété affichée (obligatoire) |
| `physics: bool` | Met à jour dans `_physics_process` au lieu de `_process` |

Instancier `watcher.tscn` dans la scène à inspecter, puis renseigner `node` et `property` dans l'inspecteur.

## Écrans et scènes de test

- **Icônes de stats** (`scenes/ui/debug/stats_icons_debug.tscn`): depuis le menu d'accueil, le bouton `debug: stats icons` ouvre la liste (ou la grille) de toutes les icônes de stats avec leur clé. Utile pour vérifier une nouvelle stat dans `StatBar`.
- **`scenes/DebugScene.tscn`**: une caméra et quatre instances de `bat_01.tscn`, à lancer depuis l'éditeur (`Run Current Scene`) pour tester une tour sans niveau.

## Tester un niveau

Les commandes de la [console](/documentation/development/guides/console/#commandes-disponibles) évitent de rejouer un niveau:

| Besoin | Commande |
|---|---|
| Lancer un niveau précis | `load_level lev.05` |
| Avoir des pièces | `set_money 5000` |
| Accélérer ou ralentir | `set_time_scale 3` |
| Voir où poser une tour | `debug-tower-placement` ([Construction](/documentation/development/guides/building-placement/#tuiles-de-placement)) |
| Améliorer ou vendre une tour | `up`, `sell` |
| Débloquer l'armurerie, un niveau, un défi | `unlock_armory`, `progression` |
| Chercher une fuite de nœuds | `orphans` |

`IMap.debug_show_spawnable_special_tiles` (export dans l'inspecteur de la carte) affiche les tuiles éligibles aux bonus et malus.

## Sorties

- Le projet est lancé avec l'argument `--verbose` depuis l'éditeur (`editor/run/main_run_args` dans `project.godot`).
- Les logs sont écrits dans `res://log`, donc seulement depuis l'éditeur. Sur un téléphone, seule la sortie de Godot les montre ([Test sur Android](/documentation/setup/android-testing/)).
- Pour la performance, utiliser le profileur et les moniteurs de l'éditeur Godot: le projet n'a pas d'outil de profilage dédié.
