---
title: Guide Dialogic
sidebar_position: 30
description: Intégrer et utiliser Dialogic 2 dans Cat'aclysm
---

# Guide Dialogic 2

Dialogic est utilisé pour créer des dialogues interactifs (narration, tutoriels, interactions contextuelles) dans Godot.

## Références officielles

- [Getting started Dialogic](https://docs.dialogic.pro/getting-started.html)
- [Documentation complète](https://docs.dialogic.pro/)
- [Releases GitHub](https://github.com/dialogic-godot/dialogic/releases)

## Installation du plugin

### Prérequis

- Godot 4.4
- Projet Godot existant

### Étapes

1. Télécharger la dernière release de Dialogic.
2. Décompresser l'archive.
3. Copier le dossier `addons/` dans la racine du projet.
4. Activer le plugin dans `Project > Project Settings > Plugins`.
5. Redémarrer Godot.

## Interface Dialogic

Une fois activé, l'onglet Dialogic apparaît dans l'éditeur.

Fonctions principales:

- créer des timelines
- créer des personnages
- gérer les ressources de dialogue
- prévisualiser le rendu

## Créer une timeline

1. Cliquer sur `Add Timeline`.
2. Donner un nom explicite.
3. Ajouter les événements de dialogue.

Exemple simple:

```text
join guide
guide: "Bienvenue dans Cat'aclysm !"
```

## Créer un personnage

1. Cliquer sur `Add Character`.
2. Définir le `Display Name`.
3. Associer des portraits (humeurs, états).

## Écriture de texte et effets

Exemple:

```text
join guide
guide: "Bienvenue, {player_name} !"
pause 1
guide: "Préparez-vous, l'aventure commence."
```

Commandes fréquentes:

- `pause 1`: pause de 1 seconde
- `{player_name}`: variable interpolée

Référence: [Writing texts](https://docs.dialogic.pro/writing-texts.html)

## Intégration GDScript

Exemple de démarrage d'une timeline depuis une scène:

```gdscript
extends Node

func _input(event: InputEvent) -> void:
    if Dialogic.current_timeline == null and event.is_action_pressed("ui_accept"):
        Dialogic.start("res://dialogues/intro.dtl")
```

## Fonctions avancées utiles

- Effets de texte (`[speed]`, `[pause]`, etc.)
- Conditions (`[if]`, `[else]`)
- Signaux (`[signal=...]`)
- Auto-advance (`[aa]`, `[aa=5]`)

Références:

- [Auto-advance](https://docs.dialogic.pro/auto-advance.html)

## Bonnes pratiques projet

- Garder des noms de timelines explicites (`intro_village`, `tutorial_combat_step_1`)
- Éviter les blocs de texte trop longs sans interaction
- Prévoir les chemins alternatifs tôt (réussite/échec)
- Garder les chaînes utilisateur compatibles avec la stratégie de traduction du projet

## Dépannage rapide

- Timeline ne démarre pas: vérifier le chemin `res://...`.
- Plugin absent: vérifier activation dans `Project Settings > Plugins`.
- Effet non appliqué: vérifier la syntaxe exacte des tags Dialogic.

## Liens liés

- [Directives de code](./coding-guidelines.md)
- [Structure des fichiers](./file-structure.md)
