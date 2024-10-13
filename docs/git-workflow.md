---
title: Git Workflow
sidebar_position: 100
description: Documentation dashboard
---

# Gitflow Workflow

## Qu'est-ce que Gitflow ?

Gitflow est un modèle de branchement Git alternatif qui repose sur l'utilisation de branches de fonctionnalités et de plusieurs branches principales.

Sous Gitflow, les développeurs créent une branche de fonctionnalité et retardent la fusion avec la branche principale jusqu'à ce que la fonctionnalité soit complète.

Ce workflow définit des rôles spécifiques pour chaque branche et comment elles doivent interagir.

:::warning
Si vous souhaitez utiliser un autre outil que git cli, demmerdez vous, merci
:::

---

## Branches principales : develop et main

Gitflow utilise deux branches principales pour gérer l'historique du projet :
- La branche `main` stocke l'historique des versions officielles.
- La branche `develop` est utilisée pour intégrer les nouvelles fonctionnalités.


## Branches de fonctionnalité (feature branches)

Chaque nouvelle fonctionnalité doit être développée dans sa propre branche, basée sur develop. Lorsque la fonctionnalité est complète, elle est fusionnée dans develop. Les branches de fonctionnalité n'interagissent jamais directement avec main.

### Créer une branche de fonctionnalité

```bash
git checkout develop
git pull --rebase
git checkout -b feature/nom_fonctionnalité
```

### Fusionner une branche de fonctionnalité

Une fois la fonctionnalité terminée, il est temps de la fusionner dans develop.

```bash
git checkout develop
git merge feature/nom_fonctionnalité
git branch -d feature/nom_fonctionnalité
```

## Branches de release

Lorsque la branche develop contient suffisamment de nouvelles fonctionnalités pour une version ou qu'une date de publication approche, une branche de release est créée à partir de develop. 

À partir de ce moment, seules les corrections de bugs et les tâches liées à la release sont autorisées sur cette branche.

## Créer une branche de release

```bash
git checkout develop
git checkout -b release/nom_release
```

## Finaliser une branche de release

Une fois prête, la branche de release est fusionnée dans main et develop, puis supprimée.

```bash
git checkout main
git merge release/nom_release
git checkout develop
git merge release/nom_release
```

## Branches de hotfix

Les branches de hotfix sont utilisées pour appliquer rapidement des correctifs sur la production. 

Elles sont créées à partir de main, et une fois le correctif terminé, elles sont fusionnées dans main et develop.

### Créer une branche de hotfix

```bash
git checkout main
git checkout -b hotfix/nom_hotfix
```

### Finaliser une branche de hotfix

Lorsque le correctif est prêt, il est fusionné dans main et develop.

```bash
git checkout main
git merge hotfix/nom_hotfix
git checkout develop
git merge hotfix/nom_hotfix
git branch -d hotfix/nom_hotfix
```