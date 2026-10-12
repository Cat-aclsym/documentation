---
title: Conventions Git
description: Conventions de commits, de branches et de pull requests
sidebar:
  order: 2
---

## GitHub

### Commit :

- Les messages de commits sont en anglais, au présent, doivent être courts et concis.
- Un message tient sur une seule ligne, sans corps ni référence de ticket.
- Les commits sont signés (`git commit -S`).

**type(scope): Description.**

* **type**: type de commit
* **scope**: la scope affectée par ce commit, 1 à 2 mots, optionnelle, peut contenir un espace
* **description**: une brève description du commit, qui commence par une majuscule et se termine par un point

#### Types :

* `ci` : Changement de fichiers et de scripts liés à l'intégration continue.
* `chore` : Changement du système de build ou des outils de développement.
* `docs` : Changement de la documentation.
* `feat` : Nouvelle fonctionnalité.
* `fix` : Correction d'un bug.
* `perf` : Optimisation du code pour améliorer les performances.
* `refactor` : Modification du code sans changer de fonctionnalité.
* `style` : Changer le style du code.

Regexp pour les messages de commit :

```regexp
(ci|chore|docs|feat|fix|perf|refactor|style)(\(.+\))?: [A-Z].*\.
```

#### Exemples :

```
feat(zombies): Add new pigeon zombie.
```

```
fix(tower-gui): Fix tower name not being displayed correctly.
```

```
refactor(tutorial): Simplify signal connections in TutorialManager.
```

```
chore(console): Rename the tower placement debug command to snake_case.
```

### Branches :

Pour une explication de l'utilisation des branches, veuillez suivre le [modèle de branches Gitflow](/documentation/contributing/git-workflow/).

#### Branch naming :

- Les noms de branches sont en anglais, brefs et concis, en minuscules et doivent être séparés par un trait d'union (`-`).
- Les noms de branche doivent commencer par le type de branche, suivi d'une barre oblique (`/`), suivie du sujet de la branche.

#### Types :

* `feature` : Nouvelle fonctionnalité
* `fix` : Correction d'un bug
* `hotfix` : Correction d'un bug critique
* `refactor` : Refactorisation sans changement de fonctionnalité
* `release` : Préparation d'une nouvelle version

#### Exemples :

```
feature/tutorial
```

```
fix/text-character-spacing
```

```
release/mateo
```

Les versions publiées sont marquées par des tags (`d0.1`, `d0.2`, `d0.3`).

### Pull requests

Quand une branche est prête à être fusionnée, une pull request doit être créée.

- Les pull requests sont écrites en anglais, doivent être claires et détaillées.
- Le job `check` de la [CI](/documentation/setup/ci/) (compilation des scripts, smoke test et tests unitaires gdUnit4) doit être vert. Les mêmes commandes se lancent en local ([Vérifications headless](/documentation/development/guides/debugging/#vérifications-headless), [Tests](/documentation/development/guides/testing/#lancer-les-tests)).
- Un changement de comportement s'accompagne d'un test dans `tests/` ([Tests](/documentation/development/guides/testing/)).
- Les développeurs travaillant sur la branche doivent être assignés à la pull request.
- Le chef technique doit être assigné en tant que reviewer.
- Les pull requests doivent être approuvées par le chef technique avant d'être fusionnées.
