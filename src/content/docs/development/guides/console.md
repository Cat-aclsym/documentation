---
title: Console de debug
description: Ouvrir la console in-game et utiliser les commandes de debug disponibles
sidebar:
  label: Console
  order: 11
---

La console exécute des commandes en cours de jeu (progression, économie, affichage). Pour en ajouter une, voir [Créer une commande](/documentation/development/guides/console-commands/).

## Disponibilité

La console n'existe qu'en debug : au démarrage, la scène se supprime si `Global.debug` est `false`. `Global.debug` vaut `OS.has_feature("debug")`: `true` dans l'éditeur et dans les exports debug, `false` dans un export release.

## Utilisation

- La touche `` ` `` (action `toggle_console`) ouvre et ferme la console, `Échap` la ferme aussi.
- `Entrée` ou `Entrée` du pavé numérique (action `console_push`) exécute la commande saisie.
- `Tab` complète la commande ou l'argument en cours, la console propose des suggestions selon le type de chaque argument et affiche la signature de la commande.
- Les flèches haut et bas parcourent les suggestions, ou l'historique des commandes quand la saisie est vide.
- La commande `help` liste les commandes disponibles avec leur signature ; `help <commande>` détaille une commande et ses sous-commandes. La console lance `help` à son démarrage.
- Les logs du jeu (voir [Logs](/documentation/development/guides/logger/)) s'affichent aussi dans la console.

Le nom d'une commande est le nom de son fichier dans `res://debug/console/commands/`, sans `.gd`. Le fichier `set_money.gd` donne la commande `set_money`. La console instancie chaque script une seule fois, à la première utilisation, et les trie par nom.

## Commandes disponibles

| Commande | Arguments | Description |
| --- | --- | --- |
| `debug_tower_placement` | aucun | Affiche ou masque une surcouche verte des tuiles où les tours sont constructibles |
| `exit` | aucun | Ferme le jeu |
| `help` | `[command]` | Liste les commandes ou détaille l'une d'elles |
| `load_level` | `level_id` | Charge et démarre un niveau par son identifiant (par exemple `lev.01`), en remplaçant le niveau en cours |
| `orphans` | aucun | Appelle `Node.print_orphan_nodes()` |
| `progression` | `action`, puis selon l'action | Gère la progression, voir [la sous-section](#progression) |
| `sell` | `tower_name` | Vend la tour indiquée et rembourse une partie de son coût |
| `set_font_size` | `size` | Change la taille de police de la console (entier positif) |
| `set_game_resolution` | `width`, `height` | Redimensionne la fenêtre pour la session en cours, sans modifier les paramètres du projet |
| `set_money` | `amount` | Définit le nombre de pièces du niveau en cours (positif ou nul) |
| `set_time_scale` | `timescale` | Change la vitesse de simulation (`Engine.time_scale`, strictement positive, 1.0 = normale) |
| `unlock_armory` | aucun | Débloque instantanément tous les nœuds de l'armurerie |
| `up` | `tower_name`, `[path]` | Améliore la tour indiquée selon un chemin d'amélioration (numéro à partir de 1, 1 par défaut) |

Les arguments entre crochets sont optionnels. `tower_name` est le nom du nœud d'une tour posée sur la carte, la console le propose à la saisie. Les commandes qui agissent sur le niveau (`debug_tower_placement`, `set_money`, `sell`, `up`) exigent d'être dans un niveau.

### `progression`

| Sous-commande | Effet |
| --- | --- |
| `progression armory stars` | Affiche les étoiles gagnées, dépensées et disponibles |
| `progression armory grant <node_id>` | Accorde un nœud de l'armurerie |
| `progression armory clear` | Efface les achats de l'armurerie (appelle `ArmoryManager.reset_armory_spending()`) |
| `progression challenge <level_id> <challenge_id>` | Marque un défi comme réussi pour un niveau |
| `progression reset` | Réinitialise la progression |
| `progression show` | Affiche la progression en JSON |
| `progression unlock enemy <enemy_id>` | Marque un ennemi comme vu (clé de `stats.json`) |
| `progression unlock level <level_id>` | Débloque un niveau |
| `progression unlock tower <tower_id>` | Débloque une tour |
| `progression unlock trap <trap_id>` | Débloque un piège |

## Exécution depuis le code

Pour déclencher une commande sans saisie manuelle:

```gdscript
Global.console.push_command("set_font_size 24")
Global.console.push_command("set_game_resolution 1280 720")
```

`Global.console` peut être `null` (console absente en release): vérifier la référence avec `is_instance_valid()` avant usage. Les méthodes de sortie (`push_text`, `push_error_`...) sont décrites dans [Créer une commande](/documentation/development/guides/console-commands/#sortie-console).
