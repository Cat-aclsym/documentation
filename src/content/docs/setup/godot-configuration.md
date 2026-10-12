---
title: Configurer l'éditeur Godot
description: Réglages de l'éditeur Godot utiles au projet et paramètres déjà définis dans project.godot
sidebar:
  label: Éditeur Godot
  order: 1
---

Peu de réglages de l'éditeur sont à configurer pour le projet, mais il est important de les connaître.
Les réglages se trouvent dans `Editor` > `Editor Settings`. L'éditeur est utilisé en anglais : les noms d'options de cette page sont ceux de l'interface anglaise.

## Réglages de l'éditeur

### Fichiers

Par défaut, Godot n'affiche dans le navigateur de fichiers que les fichiers en rapport avec Godot. Pour voir d'autres fichiers (CSV, JSON, etc.), ajouter leurs extensions dans `Docks` > `Filesystem` > `TextFile Extensions`.

### Éditeur de texte

Un éditeur externe offre une meilleure expérience de développement, voir [Configurer un éditeur externe](/documentation/setup/ide-configuration/).
Pour l'éditeur intégré à Godot, la police, sa taille, le thème, etc. se règlent dans `Text Editor`.

### Exécution

Pour lancer le jeu en fenêtre maximisée ou en plein écran de force, modifier `Run` > `Window Placement` et choisir `Force Maximized` ou `Force Fullscreen`. L'option `Screen` de la même section permet d'afficher le jeu sur un autre écran que l'éditeur.

## Paramètres du projet

Ces paramètres sont déjà enregistrés dans `project.godot`. Ils s'éditent dans `Project` > `Project Settings`.

| Paramètre | Valeur | Rôle |
| --- | --- | --- |
| `application/run/main_scene` | `res://scenes/main.tscn` | Scène lancée avec `F5` |
| `display/window/stretch/mode` | `canvas_items` | Mode d'étirement de la fenêtre |
| `display/window/stretch/aspect` | `expand` | Conserve le ratio en étendant la zone visible |
| `rendering/textures/canvas_textures/default_texture_filter` | `Nearest` | Filtrage des textures 2D sans lissage (pixel art) |
| `input_devices/pointing/emulate_touch_from_mouse` | activé | La souris émule le tactile |
| `gui/theme/custom` | `res://assets/resources/themes/generic.tres` | Thème d'interface par défaut |
| `internationalization/locale/test` | `fr` | Langue de test dans l'éditeur |
| `internationalization/pseudolocalization` | activée, sans accents, sans préfixe ni suffixe | Pseudo-localisation des textes traduits |

Réglages d'éditeur propres au projet :

- `editor/run/main_run_args` vaut `--verbose` : le jeu lancé depuis l'éditeur démarre avec cet argument.
- `editor/naming/scene_name_casing` vaut `1` et `editor/naming/script_name_casing` vaut `2`. Ces valeurs définissent la casse proposée pour les noms de scènes et de scripts créés depuis l'éditeur.

### Actions d'entrée

Le projet déclare ces actions dans `Project Settings` > `Input Map` :

| Action | Rôle |
| --- | --- |
| `toggle_console` | Ouvre et ferme la console de debug (touche `` ` ``) |
| `console_push` | Valide la commande saisie dans la console (`Entrée` ou `Entrée` du pavé numérique) |
| `dialogic_default_action` | Fait avancer un dialogue Dialogic (`Espace`, `Entrée` ou clic gauche) |
| `place_tower` | Clic gauche (déclarée, aucun script ne la lit) |
| `rmb` | Clic droit (déclarée, aucun script ne la lit) |
| `scroll_up`, `scroll_down` | Zoom de la caméra, molette de la souris ou `Cmd` + flèche haut ou bas |

Voir aussi [Console de debug](/documentation/development/guides/console/) pour l'usage de la console.
