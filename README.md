# Documentation Cat'aclysm

Documentation technique de [Cat'aclysm: Claw of the Dead](https://github.com/Cat-aclsym/Cat-aclsym_Claw_of_the_dead), construite avec [Astro Starlight](https://starlight.astro.build/) et le thème [Lucode](https://lucas-labs.github.io/lucode-starlight-theme/), publiée sur GitHub Pages: <https://cat-aclsym.github.io/documentation/>.

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
src/content/docs/      pages Markdown et MDX
src/assets/            captures du jeu et images référencées par les pages
src/components/        Footer (copyright) et IconLinkCard (carte de lien avec icône)
src/styles/custom.css  couleur d'accentuation, liens, icônes de la barre latérale, galerie de l'accueil
public/game/sprites/   sprites du jeu en PNG sans perte
astro.config.ts        configuration du site, de la barre latérale, de Mermaid et des plugins
```

La barre latérale est définie dans `astro.config.ts`: chaque groupe liste un dossier de `src/content/docs/`.
Les diagrammes Mermaid s'écrivent dans des blocs de code ```` ```mermaid ````.
Les conventions d'écriture des pages sont décrites dans `src/content/docs/contributing/writing-guidelines.md`.

## Déploiement

Le site est déployé par GitHub Actions à chaque push sur `main`, avec le workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Lancer `bun run build` avant de pousser.
