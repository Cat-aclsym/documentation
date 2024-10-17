---
title: Configuration Docusaurus
sidebar_position: 10
description: Configuration git
---

# Configuration Docusaurus

Cet article décrit comment installer, tester, et deployer la documentation [Docusaurus](https://docusaurus.io/).

---

## Prerequis

- Installer [Node.js](https://nodejs.org/fr) **lts v20.18**
- Installer [Yarn](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-the-yarn-package-manager-for-node-js) package manager for Node.js **v1.22** : `npm install -g yarn`

## Installation

```bash
git clone https://github.com/Cat-aclsym/documentation
cd ./documentation
npm install
```

## Test

```bash
cd ./documentation
npm run start
```

## Deploiement

:::warning Deprecated
Le deploiement manuel n'est plus necessaire.

Pousser une modification sur la branche `main` provoque le deploiement automatiquement via une action github.
:::

### bash
```bash
GIT_USER=<GITHUB_USERNAME> yarn deploy
```

### windows
```sh
cmd /C "set "GIT_USER=<GITHUB_USERNAME>" && yarn deploy"
```

### powershell
```powershell
cmd /C 'set "GIT_USER=<GITHUB_USERNAME>" && yarn deploy'
```


## Workflow

1. Mettre a jour la doc : `git pull --rebase`
2. Modifier / Ajouter des pages
3. [Tester](https://cat-aclsym.github.io/documentation/docs/setup/docusaurus-configuration#test) les modifications
4. Pousser les mises a jour
```bash
git add .
git commit -m "..."
git push origin main
```


## Liens utiles