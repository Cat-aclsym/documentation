---
title: Exporter le jeu
description: Exporter le jeu pour Android et Windows
sidebar:
  order: 40
---

Cette page décrit l'export du projet avec Godot 4.4.
Le projet contient deux presets d'export (`export_presets.cfg`): **Android** et **Windows Desktop**. Il n'existe pas de preset iOS ni Web.

## Exporter pour Android

Pour exporter le jeu pour Android, vous devez d'abord installer les outils nécessaires.

1. Installer [Android Studio](https://developer.android.com/studio).
2. Installer Java 17 ou plus récent.
3. Installer le SDK Android 34.0.0 ou plus récent, attention à bien vérifier le support de la version par Godot 4.4.
4. Installer CMake 3.10.2 et NDK 23.2 ou plus récent.
5. Configurer les chemins vers ces outils dans Godot dans `Editor` > `Editor Settings` > `Export` > `Android`.

Le preset **Android** exporte vers `exports/Cat-aclsym_Claw_of_the_dead.apk`, sans build Gradle, pour les architectures `arm64-v8a` et `x86_64`.

Ensuite, exportez le projet:

1. Ouvrir `Project` > `Export` et sélectionner le preset Android.
2. Exporter le projet.

Vous pouvez suivre le tutoriel officiel de Godot pour cela : [Exporter pour Android](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html).

## Exporter pour Windows

Le preset **Windows Desktop** exporte vers `exports/Cat-aclsym_Claw_of_the_dead.exe`, en `x86_64` avec le `.pck` embarqué.

Étapes recommandées:

1. Ouvrir `Project` > `Export` et sélectionner le preset Windows Desktop.
2. Vérifier l'icône, le nom d'exécutable et les options d'architecture.
3. Exporter en mode release pour les tests de build.
4. Tester le lancement sur une machine propre.

Tutoriel officiel: [Exporter pour Windows](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_windows.html).

## Build CI Android

Le workflow GitHub Actions `Build Cat'aclysm Android APK` (`.github/workflows/build.yml` du projet Godot) construit l'APK à chaque push sur `main` et `develop`.

Il enchaîne:

1. Installation de Java 17 (Temurin) et de Godot 4.4.0 en mode headless, puis des templates d'export 4.4.
2. Décodage du keystore depuis le secret `KEYSTORE_BASE64`, et injection de ses identifiants (secret `KEYSTORE_PASSWORD`) dans `export_presets.cfg`.
3. Import du projet et export de l'APK avec le preset `Android`.
4. Injection dans l'APK de l'intent filter Firebase Game Loop (`com.google.intent.action.TEST_LOOP`) avec `apktool`.
5. Signature de l'APK avec `apksigner` (build-tools 34.0.0).
6. Publication de `exports/Cataclysm.apk` dans l'artefact `Cataclysm-apk`.
