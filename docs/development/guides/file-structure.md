---
title: Structure des fichiers
sidebar_position: 2
description: Organisation recommandée du projet Godot Cat'aclysm
---

# Structure des fichiers

Cette page décrit l'organisation des dossiers du projet Godot et les conventions associées.
Le but est de retrouver rapidement une feature, éviter les doublons et garder un découpage stable dans le temps.

## Vue d'ensemble

Arborescence principale:

- `addons/`: plugins externes (à ignorer pour le gameplay courant)
- `assets/`: ressources artistiques et audio
- `resources/`: données de configuration (JSON, ressources de progression, etc.)
- `scenes/`: composition visuelle des fonctionnalités
- `scripts/`: logique transverse et systèmes réutilisables
- `log/`: logs runtime générés

## Règle pratique importante

Par défaut, on ne modifie pas `addons/` sauf si le travail concerne explicitement un plugin ou une dépendance vendored.

## Détail par dossier

### assets/

Contient les éléments de production:

- audio (musique, SFX)
- sprites et visuels gameplay
- UI (icônes, fonts, textures)
- traductions

Conseils:

- conserver une convention de nommage en `snake_case`
- regrouper par usage réel (`ui/`, `gameplay/`, `environment/`)
- maintenir le pixel art en filtrage nearest

### scenes/

Regroupe les `.tscn` par domaine fonctionnel:

- `gameplay/`: tours, ennemis, projectiles, placement, monde
- `ui/`: HUD, menus, overlays
- `utilities/`: outils debug (console, widgets utilitaires)
- `narrative/`: éléments narratifs/dialogue

Conventions:

- préférer des scènes auteurs (nœuds déjà composés)
- limiter la création dynamique de nœuds aux cas réellement nécessaires
- garder le script proche de sa scène quand il est spécifique à cette scène

### scripts/

Scripts de logique globale non attachés à une scène unique:

- `autoloads/`: services globaux (`Global`, `SoundManager`, `ScenesLoader`, `StatsDB`, `ProgressionManager`, `ChallengeManager`)
- `commands/`: commandes console implémentant `ICommand`
- `log/`: système de logs
- `state_machine/`: infrastructure de machine d'états (`StateMachine`, `State`, `Transition`)
- `utilities/`: helpers transverses
- autres domaines (`wave/`, `challenges/`, `progression/`, etc.)

Conventions:

- organiser par domaine métier
- éviter les scripts fourre-tout
- conserver des API stables pour les systèmes partagés

### resources/

Contient les fichiers de données et de configuration, typiquement consommés par les systèmes de progression/statistiques.

### log/

Dossier de sortie runtime pour les fichiers de logs de session.

Format attendu des noms de fichiers: `YYYY_MM_DD-hh_mm.log`.

## Exemple d'arborescence (simplifié)

```text
res://
├── addons/
├── assets/
│   ├── audio/
│   ├── gameplay/
│   ├── translations/
│   └── ui/
├── resources/
├── scenes/
│   ├── gameplay/
│   │   └── entities/
│   │       ├── enemy/
│   │       ├── tower/
│   │       └── bullet/
│   ├── ui/
│   ├── utilities/
│   └── narrative/
├── scripts/
│   ├── autoloads/
│   ├── commands/
│   ├── log/
│   ├── state_machine/
│   ├── utilities/
│   └── wave/
├── log/
└── project.godot
```

## Où créer quoi?

- Nouvelle entité gameplay avec composition visuelle: `scenes/gameplay/...`
- Nouveau service global: `scripts/autoloads/...`
- Nouvelle commande de console: `scripts/commands/...`
- Nouveau helper transverse: `scripts/utilities/...`
- Nouveau modèle de données/config: `resources/...`

## Exemples concrets

1. Ajouter une commande debug `spawn_enemy`
   - script dans `scripts/commands/spawn_enemy.gd`
   - implémentation `extends ICommand`
   - déclaration des arguments via `get_args()`

2. Ajouter un nouvel ennemi
   - scène dans `scenes/gameplay/entities/enemy/enemies/`
   - script dérivé de `IEnemy`
   - stats via `StatsDB`

3. Ajouter une nouvelle UI persistante
   - scène dans `scenes/ui/`
   - script `Control` ou `CanvasLayer`
   - référence stockée dans `Global` si nécessaire

## Liens utiles

- [Directives de code](./coding-guidelines.md)
- [Logger](./logger.md)
- [Console](./console.md)
