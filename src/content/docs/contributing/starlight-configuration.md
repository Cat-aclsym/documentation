---
title: Site de documentation (Starlight)
description: Installer, tester et déployer le site de documentation Starlight
sidebar:
  label: Site de doc
  order: 4
---

Le site est construit avec [Starlight](https://starlight.astro.build/), le thème de documentation d'[Astro](https://astro.build/).

## Prérequis

- Installer [Node.js](https://nodejs.org/fr) **LTS v24** ou plus récent
- Installer [Bun](https://bun.sh/) **v1.4.3** ou plus récent

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

Le workflow de déploiement se trouve dans [.github/workflows/deploy.yml](https://github.com/Cat-aclsym/documentation/blob/main/.github/workflows/deploy.yml).

Il:

1. installe Bun,
2. exécute `bun install --frozen-lockfile`,
3. lance `bun run build`,
4. publie le contenu du dossier `dist` sur GitHub Pages.

## Configuration

- `astro.config.ts`: URL du site, base `/documentation`, barre latérale, lien d'édition, dernière mise à jour, intégration Mermaid et plugins (thème `lucode-starlight`, zoom d'images, validation des liens, `llms.txt`).
- `src/content/docs/`: pages Markdown de la documentation. Chaque dossier est un groupe de la barre latérale : `introduction`, `setup`, `development/guides`, `development/models`, `development/user-flows` et `contributing`.
- `src/assets/`: captures du jeu et images référencées par les pages.
- `public/game/sprites/`: sprites du jeu en PNG sans perte (le WebP d'Astro les flouterait).
- `src/components/Footer.astro`: ajoute la ligne de copyright au pied de page du thème.
- `src/components/IconLinkCard.astro`: carte de lien avec une icône Starlight, le `LinkCard` de Starlight n'en ayant pas.
- `src/styles/custom.css`: déclare l'ordre des couches `starlight, lucode` pour que le thème l'emporte, puis la couleur d'accentuation, les liens verts, les icônes de la barre latérale et la galerie de l'accueil, hors couche.

## Workflow

1. `git pull --rebase`, puis créer une branche.
2. Modifier ou ajouter des pages ([règles de rédaction](/documentation/contributing/writing-guidelines/)).
3. [Tester](#test) les modifications.
4. Commit, push, puis ouvrir une pull request (par exemple `docs(contributing): Update starlight configuration page.`).

Voir les [Conventions Git](/documentation/contributing/git-guidelines/) pour les conventions de commits, de branches et de pull requests.
