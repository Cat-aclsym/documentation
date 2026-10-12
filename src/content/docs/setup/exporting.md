---
title: Exporter le jeu
description: Exporter le jeu pour Android et Windows
sidebar:
  label: Export
  order: 5
---

Le projet contient deux presets d'export (`export_presets.cfg`): **Android** et **Windows Desktop**. Il n'existe pas de preset iOS ni Web.

## Exporter pour Android

Installer d'abord les outils nécessaires:

1. Installer [Android Studio](https://developer.android.com/studio).
2. Installer Java 17 ou plus récent.
3. Installer le SDK Android 34.0.0 ou plus récent, attention à bien vérifier le support de la version par Godot 4.4.
4. Installer CMake 3.10.2 et NDK 23.2 ou plus récent.
5. Configurer les chemins vers ces outils dans Godot dans `Editor` > `Editor Settings` > `Export` > `Android`.

Le preset **Android** exporte vers `exports/Cat-aclsym_Claw_of_the_dead.apk`, sans build Gradle, pour les architectures `arm64-v8a` et `x86_64`.

Ensuite, ouvrir `Project` > `Export`, sélectionner le preset Android et exporter. Tutoriel officiel: [Exporter pour Android](https://docs.godotengine.org/en/4.4/tutorials/export/exporting_for_android.html).

## Exporter pour Windows

Le preset **Windows Desktop** exporte vers `exports/Cat-aclsym_Claw_of_the_dead.exe`, en `x86_64` avec le `.pck` embarqué.

Ouvrir `Project` > `Export`, sélectionner le preset Windows Desktop puis exporter. Tutoriel officiel: [Exporter pour Windows](https://docs.godotengine.org/en/4.4/tutorials/export/exporting_for_windows.html).

## Build CI Android

Un workflow GitHub Actions construit, patche et signe l'APK à chaque push sur `main`, `develop` et `feature/workflow`. Les étapes et les secrets sont décrits dans [Intégration continue](/documentation/setup/ci/).
