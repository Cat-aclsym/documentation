---
title: Exporter le jeu
sidebar_position: 40
description: Exporter le jeu
---

# Exporter le jeu

## Exporter pour Android

Pour exporter le jeu pour Android, vous devez d'abord installer les outils nécessaires.

1. Installer [Android Studio](https://developer.android.com/studio).
2. Installer Java 17 ou plus récent.
3. Installer le SDK Android 34.0.0 ou plus récent, attention à bien vérifier le support de la version par Godot.
4. Installer CMake 3.10.2 et NDK 23.2 ou plus récent.
5. Configurer les chemins vers ces outils dans Godot dans `Editor` > `Editor Settings` > `Export` > `Android`.

Ensuite, créez une configuration d'export pour Android dans Godot.

1. Ajouter un nouvel export pour Android.
2. Configurez le chemin où exporter le projet.
3. Exportez le projet pour Android.

Vous pouvez suivre le tutoriel officiel de Godot pour cela : [Exporter pour Android](https://docs.godotengine.org/en/stable/getting_started/workflow/export/exporting_for_android.html).

## Exporter pour iOS

Pour exporter le jeu pour iOS, vous devez d'abord installer les outils nécessaires.

1. Se procurer un Mac.
2. Installer Xcode.
3. Installer Godot sur le Mac.

Ensuite, créez une configuration d'export pour iOS dans Godot.

1. Ajouter un nouvel export pour iOS.
2. Indiquez votre identifiant App Store Team ID.
3. Configurez le chemin où exporter le projet.
4. Ouvrez le projet dans Xcode puis exportez-le pour iOS.

## Exporter pour Windows

Si vous avez besoin d'une version PC dy hey, vous pouvez suivre le tutoriel officiel de Godot pour cela : [Exporter pour Windows](https://docs.godotengine.org/en/stable/getting_started/workflow/export/exporting_for_windows.html).
