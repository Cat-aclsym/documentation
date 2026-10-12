---
title: Modèle de branches (Gitflow)
description: Modèle de branches Gitflow du projet et passage par les pull requests
sidebar:
  label: Branches Git
  order: 1
---

Le projet suit Gitflow: chaque fonctionnalité vit dans sa branche jusqu'à ce qu'elle soit complète. Toute fusion dans `develop` ou `main` passe par une pull request ([Conventions Git](/documentation/contributing/git-guidelines/#pull-requests)).

## Branches principales

- `main` stocke l'historique des versions officielles.
- `develop` intègre les nouvelles fonctionnalités.

## Branches de fonctionnalité

Chaque fonctionnalité est développée dans sa propre branche, basée sur `develop`, puis fusionnée dans `develop` par pull request. Elle n'interagit jamais directement avec `main`.

### Créer une branche de fonctionnalité

```bash
git checkout develop
git pull --rebase
git checkout -b feature/nom_fonctionnalité
```

### Fusionner une branche de fonctionnalité

Une fois la fonctionnalité terminée, publier la branche et ouvrir une pull request vers `develop`.

```bash
git push -u origin feature/nom_fonctionnalité
```

Après la fusion de la pull request, supprimer la branche locale :

```bash
git checkout develop
git pull --rebase
git branch -d feature/nom_fonctionnalité
```

## Branches de release

Quand `develop` contient assez de fonctionnalités pour une version, une branche de release (par exemple `release/mateo`) est créée à partir de `develop`. Seules les corrections de bugs et les tâches liées à la release y sont autorisées.

### Créer une branche de release

```bash
git checkout develop
git checkout -b release/nom_release
git push -u origin release/nom_release
```

### Finaliser une branche de release

Une fois prête, la branche de release est fusionnée dans `main` puis dans `develop`, chaque fois par une pull request. Elle est ensuite supprimée.

```bash
git push origin --delete release/nom_release
git branch -d release/nom_release
```

## Branches de hotfix

Une branche de hotfix corrige rapidement la production. Elle est créée à partir de `main`, puis fusionnée dans `main` et dans `develop` par deux pull requests. Le dépôt du jeu ne contient aucune branche de hotfix à ce jour.

### Créer une branche de hotfix

```bash
git checkout main
git checkout -b hotfix/nom_hotfix
```

### Finaliser une branche de hotfix

Lorsque le correctif est prêt, ouvrir une pull request vers `main` et une vers `develop`, puis supprimer la branche après leur fusion.

```bash
git branch -d hotfix/nom_hotfix
```
