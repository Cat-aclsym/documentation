---
title: Configuration IDE
sidebar_position: 30
description: Configuration IDE
---


# IDE Configuration 

Godot peut être utilisé avec certains éditeurs de code externes, voici comment le mettre en place pour VSCode ou un IDE Jetbrains.
Page de documentation pour la configuration des IDEs : https://docs.godotengine.org/en/stable/tutorials/editor/external_editor.html

## VSCode

1. Installer [VSCode](https://code.visualstudio.com/)
2. Installer extensions [godot-tools](https://marketplace.visualstudio.com/items?itemName=geequlim.godot-tools) pour le support des scripts GDScript.
3. _(optionnel)_ Installer extensions [Godot Files](https://marketplace.visualstudio.com/items?itemName=alfish.godot-files) pour le support des fichiers scènes, shaders et configuration de Godot.


## Jetbrains IDE

1. Installer un des [IDE Jetbrains](https://www.jetbrains.com/fr-fr/)
2. Installer le plugin [GdScript](https://plugins.jetbrains.com/plugin/20123-gdscript), il y en a d'autres qui existent mais c'est le plus complet en fin 2024. Si vous avez installé Rider, il faudra désactiver le plugin de base pour Godot.
3. _(optionnel)_ Installer l'extension Python si vous n'êtes pas sur PyCharm pour avoir le support des fichiers CSV pour les traductions.

### Configurer une Run Configuration pour lancer le jeu

1. Créer une Run Configuration de type Godot.
2. Inscrire le lien complet du `godot.exe`.
3. _(optionnel)_ Rajouter des [paramètres supplémentaires](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html) comme `-m` pour lancer le jeu en fenêtre maximisée.

## Configuration de Godot

1. Sur Godot : `Editor` > `Editor Settings` > `Text Editor` > `External`
2. `Use external editor` : Cocher
3. `Exec path` : Mettre le lien absolu vers votre fichier `.exe` de l'éditeur choisi
4. `Exec flags` :
- VSCode : `{project} --goto {file}:{line}:{col}`
- Jetbrains : `{project} --line {line} {file}`
