---
title: Exporter le jeu
sidebar_position: 40
description: Exporter le jeu
---

# Exporter le jeu

Cette page décrit l'export du projet avec Godot 4.4.

## Exporter pour Android

Pour exporter le jeu pour Android, vous devez d'abord installer les outils nécessaires.

1. Installer [Android Studio](https://developer.android.com/studio).
2. Installer Java 17 ou plus récent.
3. Installer le SDK Android 34.0.0 ou plus récent, attention à bien vérifier le support de la version par Godot 4.4.
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
3. Installer Godot 4.4 sur le Mac.

Ensuite, créez une configuration d'export pour iOS dans Godot.

1. Ajouter un nouvel export pour iOS.
2. Indiquez votre identifiant App Store Team ID.
3. Configurez le chemin où exporter le projet.
4. Ouvrez le projet dans Xcode puis exportez-le pour iOS.

## Exporter pour Windows

Si vous avez besoin d'une version PC, vous pouvez suivre le tutoriel officiel Godot 4.4: [Exporter pour Windows](https://docs.godotengine.org/en/stable/getting_started/workflow/export/exporting_for_windows.html).

Étapes recommandées:

1. Ajouter un preset Windows Desktop dans l'onglet d'export Godot.
2. Vérifier l'icône, le nom d'exécutable et les options d'architecture.
3. Exporter en mode release pour les tests de build.
4. Tester le lancement sur une machine propre.

## Exporter pour le Web

Pour publier une version web avec Godot 4.4, exportez le projet en HTML5/Web puis servez le dossier généré tel quel sur un hébergement statique comme Firebase Hosting pour les tests, ou GitHub Pages pour une publication plus large.

Points à garder en tête:

1. Utiliser `index.html` comme nom de sortie.
2. Laisser les fichiers générés (`.js`, `.wasm`, `.pck`) avec leurs noms d'export.
3. Préférer l'export sans threads si vous ne contrôlez pas les en-têtes HTTP.
4. Si vous activez les threads, il faut des en-têtes `COOP` et `COEP` ou une solution équivalente.
5. Pour les builds de validation, Firebase Hosting sert de cible de test web.

Vous pouvez suivre la documentation officielle Godot 4.4 pour cela : [Exporter pour le Web](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html).
