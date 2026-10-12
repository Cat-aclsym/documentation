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

- La touche `` ` `` (action `toggle_console`) ouvre et ferme la console.
- `Entrée` ou `Entrée` du pavé numérique (action `console_push`) exécute la commande saisie.
- `Tab` complète la commande ou l'argument en cours, la console propose des suggestions selon le type de chaque argument.
- La commande `help` liste les commandes disponibles ; `help <commande>` détaille une commande. La console lance `help` à son démarrage.
- Les logs du jeu (voir [Logs](/documentation/development/guides/logger/)) s'affichent aussi dans la console.

Le nom d'une commande est le nom de son fichier dans `res://scripts/commands/`, sans `.gd`. Le fichier `set_money.gd` donne la commande `set_money`.

## Commandes disponibles

| Commande | Arguments | Description |
| --- | --- | --- |
| `debug-tower-placement` | aucun | Affiche ou masque une surcouche des tuiles où les tours sont constructibles |
| `exit` | aucun | Ferme le jeu |
| `help` | `[command]` | Liste les commandes ou détaille l'une d'elles |
| `load_level` | `level_id` | Charge et démarre un niveau par son identifiant (par exemple `lev.01`) |
| `orphans` | aucun | Appelle `print_orphan_nodes` |
| `progression` | `action`, puis selon l'action | Gère la progression: `armory`, `challenge`, `reset`, `show`, `unlock` |
| `sell` | `tower_name` | Vend la tour indiquée et rembourse une partie de son coût |
| `set_font_size` | `size` | Change la taille de police de la console |
| `set_game_resolution` | `width`, `height` | Change la résolution de la fenêtre |
| `set_money` | `amount` | Définit le nombre de pièces du niveau en cours |
| `set_time_scale` | `timescale` | Change la vitesse de simulation (1.0 = normale) |
| `unlock_armory` | aucun | Débloque instantanément tous les nœuds de l'armurerie |
| `up` | `tower_name`, `[path]` | Améliore la tour indiquée selon un chemin d'amélioration (numéro à partir de 1, 1 par défaut) |

Les arguments entre crochets sont optionnels. Les arguments de `progression` dépendent de l'action choisie, la console les propose à la saisie. Les commandes qui agissent sur le niveau (`set_money`, `sell`, `up`) exigent d'être dans un niveau.

## Exécution depuis le code

Pour déclencher une commande sans saisie manuelle:

```gdscript
Global.console.push_command("set_font_size 24")
Global.console.push_command("set_game_resolution 1280 720")
```

`Global.console` peut être `null` (console absente en release): vérifier la référence avant usage. Les méthodes de sortie (`push_text`, `push_error_`...) sont décrites dans [Créer une commande](/documentation/development/guides/console-commands/#sortie-console).
