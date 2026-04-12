# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ bun install
```

### Local Development

```
$ bun run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ bun run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Deployment is handled automatically by GitHub Actions on pushes to `main`.
The workflow lives in [.github/workflows/upload-pages-artifact.yml](.github/workflows/upload-pages-artifact.yml).

For local validation, use `bun run build` before pushing.
