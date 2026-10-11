---
title: Configuration Starlight
description: Installer, tester et déployer la documentation Starlight
sidebar:
  order: 10
---

Cet article décrit comment installer, tester, et déployer la documentation [Starlight](https://starlight.astro.build/), le thème de documentation d'[Astro](https://astro.build/).

---

## Prérequis

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
bun run dev
```

Le site est servi sur `http://localhost:4321/documentation/`.

Avant de pousser, construire le site et vérifier les types:

```bash
bun run build
bun run typecheck
```

Le build échoue si un lien interne ou une ancre est cassé.

## Déploiement

Fusionner une modification sur la branche `main` déclenche automatiquement le déploiement via GitHub Actions.

Le workflow de déploiement se trouve dans [.github/workflows/upload-pages-artifact.yml](https://github.com/Cat-aclsym/documentation/blob/main/.github/workflows/upload-pages-artifact.yml).

Il:

1. installe Bun,
2. exécute `bun install --frozen-lockfile`,
3. lance `bun run build`,
4. publie le contenu du dossier `dist` sur GitHub Pages.

## Configuration

- `astro.config.ts`: URL du site, base `/documentation`, barre latérale, lien d'édition, dernière mise à jour et intégration Mermaid.
- `src/content/docs/`: pages Markdown de la documentation.
- `src/assets/`: images référencées par les pages.
- `src/styles/custom.css`: couleurs d'accentuation.

## Workflow

1. Mettre à jour la doc : `git pull --rebase`
2. Créer une branche, modifier ou ajouter des pages
3. [Tester](#test) les modifications
4. Vérifier le workflow GitHub Actions si le déploiement doit être ajusté
5. Commit, push, puis ouvrir une pull request

```bash
git add .
git commit -m "docs(setup): Update starlight configuration page."
git push origin feature/doc-update
```

Voir les [Git Guidelines](/documentation/development/guides/git-guidelines/) pour les conventions de commits, de branches et de pull requests.
