# Documentation Cat'aclysm

Documentation technique de Cat'aclysm, construite avec [Astro Starlight](https://starlight.astro.build/) et publiée sur GitHub Pages: <https://cat-aclsym.github.io/documentation/>.

## Commandes

```bash
bun install            # installe les dépendances
bun run dev            # serveur local sur http://localhost:4321/documentation/
bun run build          # génère le site dans dist/ et valide les liens internes
bun run preview        # sert le contenu de dist/
bun run typecheck      # vérifie les types (astro check)
```

## Structure

```text
src/content/docs/      pages Markdown (un dossier = un groupe de la barre latérale)
src/assets/            images référencées par les pages
src/components/        surcharges de composants Starlight
src/styles/custom.css  couleurs d'accentuation
public/                favicon et fichiers servis tels quels
astro.config.ts        configuration du site, de la barre latérale et de Mermaid
```

Les diagrammes Mermaid s'écrivent dans des blocs de code ```` ```mermaid ````.
Les conventions d'écriture des pages sont décrites dans `src/content/docs/writing-guidelines.md`.

## Déploiement

Le déploiement est automatique via GitHub Actions à chaque push sur `main`.
Le workflow se trouve dans [.github/workflows/upload-pages-artifact.yml](.github/workflows/upload-pages-artifact.yml).

Lancer `bun run build` avant de pousser.
