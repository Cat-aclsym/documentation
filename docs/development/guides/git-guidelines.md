---
title: Git Guidelines
sidebar_position: 5
description: Guidelines for using Git
---

## GitHub

#### Commit :

- Les messages de commits sont en anglais, au présent, doivent être courts et concis.

**type(scope): subject<br/><br/>closes**

* **type**: type de commit
* **scope**: la scope affectée par ce commit 1 à 2 mots, peut contenir un espace
* **subject**: une brève description du commit, environ 20 mots maximum, peut contenir ou non une majuscule
* **closes**: une liste des tickets fermés par ce commit, au format `Close #42`, séparés par une virgule et un espace

#### Types :

* `ci` : Changement de fichiers et de scripts liés à l'intégration continue.
* `chore` : Changement du système de build ou des outils de développement.
* `docs` : Changement de la documentation.
* `feat` : Nouvelle fonctionnalité.
* `fix` : Correction d'un bug.
* `perf` : Optimisation du code pour améliorer les performances.
* `refactor` : Modification du code sans changer de fonctionnalité.
* `style` : Changer le style du code.
* `tweak` : Petit changement dans le code qui ne change pas la fonctionnalité.

Regexp pour les messages de commit :

```regexp
(ci|chore|docs|feat|fix|perf|refactor|style|tweak)(\(.*\)): [A-Z].*\.(\s+Closes #\d+(, closes #\d+)*)?
```

#### Exemples :

```
feat(zombies): Add new pigeon zombie.
```

```
fix(tower gui): fix tower name not being displayed correctly
```

```
tweak(animations): Change zombie animation speed.
```

```
feat(ingredients): Add new ingredient.

Closes #42
```

### Branches :

Pour une explication de l'utilisation des branches, veuillez suivre le [Gitflow Workflow](../../git-workflow.md).

#### Branch naming :

- Les noms de branches sont en anglais, brefs et concis, en minuscules et doivent être séparés par un trait d'union (`-`).
- Les noms de branche doivent commencer par le type de branche, suivi d'une barre oblique (`/`), suivie du sujet de la branche.

#### Types :

* `feature` : Nouvelle fonctionnalité
* `fix` : Correction d'un bug
* `hotfix` : Correction d'un bug critique
* `release` : Préparation d'une nouvelle version

#### Examples :

```
feature/big-zombie
```

```
fix/fix-tower-gui
```

### Pull requests :

Quand une branche est prête à être fusionnée, une pull request doit être créée.

- Les pulls requests sont écrites en anglais, doivent être claires et détallées.
- Les développeurs travaillant sur la branche doivent être assignés à la pull request.
- Le chef technique doit être assigné en tant que reviewer.
- Les pulls requests doivent être approuvées par le chef technique avant d'être fusionnées.
