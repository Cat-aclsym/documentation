---
title: Configurer un éditeur externe
description: Utiliser VSCode ou un IDE Jetbrains avec Godot
sidebar:
  label: Éditeur externe
  order: 2
---

Godot peut être utilisé avec certains éditeurs de code externes. Cette page explique comment le mettre en place pour VSCode ou un IDE Jetbrains.
Voir aussi la [documentation Godot sur les éditeurs externes](https://docs.godotengine.org/en/4.4/tutorials/editor/external_editor.html).

## VSCode

1. Installer [VSCode](https://code.visualstudio.com/)
2. Installer l'extension [godot-tools](https://marketplace.visualstudio.com/items?itemName=geequlim.godot-tools) pour le support des scripts GDScript.
3. _(optionnel)_ Installer l'extension [Godot Files](https://marketplace.visualstudio.com/items?itemName=alfish.godot-files) pour le support des fichiers de scènes, de shaders et de configuration de Godot.

## Jetbrains IDE

1. Installer un des [IDE Jetbrains](https://www.jetbrains.com/fr-fr/)
2. Installer le plugin [GdScript](https://plugins.jetbrains.com/plugin/20123-gdscript). D'autres plugins existent, celui-ci est le plus complet.

### Configurer une Run Configuration pour lancer le jeu

1. Créer une Run Configuration de type Godot.
2. Inscrire le chemin complet de `godot.exe`.
3. _(optionnel)_ Ajouter des [paramètres supplémentaires](https://docs.godotengine.org/en/4.4/tutorials/editor/command_line_tutorial.html), par exemple `-m` pour lancer le jeu en fenêtre maximisée.

## Configuration de Godot

1. Dans Godot : `Editor` > `Editor Settings` > `Text Editor` > `External`
2. `Use external editor` : cocher
3. `Exec path` : chemin absolu vers l'exécutable de l'éditeur choisi
4. `Exec flags` :
   - VSCode : `{project} --goto {file}:{line}:{col}`
   - Jetbrains : `{project} --line {line} {file}`
