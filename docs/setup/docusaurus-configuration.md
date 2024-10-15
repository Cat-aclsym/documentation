---
title: Configuration Docusaurus
sidebar_position: 10
description: Configuration git
---

# Configuration Docusaurus

Cette article decris comment installer, tester, modifier et deployer la documentation [Docusaurus](https://docusaurus.io/).

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


## Edition


## Deploiement

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


## Liens utiles