---
title: Tester en direct sur le Téléphone
sidebar_position: 30
description: Tester le jeu en direct sur un téléphone
---

# Tester en direct sur le Téléphone

Il est possible de tester le jeu directement sur un téléphone Android depuis l'éditeur Godot.

## Prérequis

- Avoir un téléphone Android
- Avoir un câble USB pour connecter le téléphone à l'ordinateur
- Avoir le projet Godot d'installé sur l'ordinateur
- Avoir mis en place le système [d'exportation pour Android](../../setup/exporting.md#exporter-pour-android)

## Mode développeur

Pour pouvoir tester le jeu en direct sur un téléphone, il faut activer le mode développeur sur le téléphone.
Pour ce faire :
1. Allez dans les paramètres du téléphone
2. Allez dans la section "À propos du téléphone"
3. Cherchez la section "Numéro de build" et appuyez dessus plusieurs fois jusqu'à ce qu'un message vous indique que le mode développeur est activé
4. Retournez dans les paramètres et cherchez la section "Options pour les développeurs"
5. Activez les options `Installer via USB` et `Débogage USB`

## Tester le jeu

1. Connectez le téléphone à l'ordinateur avec le câble USB
2. Activez le partage de fichiers via la connexion USB
3. Ouvrez le projet Godot
4. Cliquez sur le bouton "Débogage Distant" en haut à droite de l'interface
5. Sélectionner votre téléphone

![Exemple de lancement sur téléphone depuis l'éditeur Godot](/img/run-on-phone.png)

L'application va s'installer, puis se lancer sur le téléphone, vous pourrez voir les logs de l'application dans l'éditeur Godot.
Si vous modifiez le code ou les ressources, l'application se mettra à jour automatiquement sur le téléphone.

:::note
Il se peut que l'application ne soit plus lançable une fois déconnectée du câble USB, il faudra alors la réinstaller depuis un export.
:::

## Problèmes courants

### Bouton "Débogage Distant" grisé

Si le bouton "Débogage Distant" est grisé, cela signifie que Godot n'a pas trouvé de périphérique Android connecté.
Vérifiez bien d'avoir activé le mode développeur et le débogage USB sur le téléphone, et que le téléphone est bien connecté à l'ordinateur en mode partage de fichiers.

### Impossible d'installer l'application

Vérifiez si l'option `Installer via USB` dans les options pour les développeurs du téléphone est bien activée.
