---
title: Configuration Docusaurus
sidebar_position: 10
description: Configuration git
---

# Configuration Docusaurus

Cet article décrit comment installer, tester, et deployer la documentation [Docusaurus](https://docusaurus.io/).

---

## Prerequis

- Installer [Node.js](https://nodejs.org/fr) **LTS v24** ou plus récent
- Installer [Bun](https://bun.sh/) **v1.3.11** ou plus récent

## Installation

```bash
git clone https://github.com/Cat-aclsym/documentation
cd ./documentation
bun install
```

## Test

```bash
cd ./documentation
bun run start
```

## Deploiement

Pousser une modification sur la branche `main` provoque le deploiement automatiquement via GitHub Actions.
:::

Le workflow de déploiement se trouve dans [.github/workflows/upload-pages-artifact.yml](../../.github/workflows/upload-pages-artifact.yml).

Il:

1. installe Bun,
2. exécute `bun install`,
3. lance `bun run build`,
4. publie le contenu du dossier `build` sur GitHub Pages.

## Workflow

1. Mettre a jour la doc : `git pull --rebase`
2. Modifier / Ajouter des pages
3. [Tester](https://cat-aclsym.github.io/documentation/docs/setup/docusaurus-configuration#test) les modifications
4. Vérifier le workflow GitHub Actions si le déploiement doit être ajusté
5. Pousser les mises a jour
```bash
git add .
git commit -m "..."
git push origin main
```
