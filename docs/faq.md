---
title: FAQ
sidebar_position: 999
description: Questions fréquentes sur Cat'aclysm et sa documentation
---

# FAQ

## Onboarding

### Je suis nouveau sur le projet. Je commence par quoi?

Ordre recommandé:

1. [Présentation](./introduction/overview.md)
2. [Prérequis](./introduction/prerequisites.md)
3. [Installation](./introduction/installation.md)
4. [Directives de code](./development/guides/coding-guidelines.md)
5. [Structure des fichiers](./development/guides/file-structure.md)

### Où sont les conventions GDScript officielles du projet?

Dans [Directives de code](./development/guides/coding-guidelines.md).

## Développement

### Où créer une nouvelle commande de debug?

Dans `res://scripts/commands/`, en héritant de `ICommand`.
Voir le guide: [Console debug](./development/guides/console.md).

### Où logger proprement un événement de gameplay?

Utiliser `Log.trace(...)` au lieu de `print()`.
Voir [Logger](./development/guides/logger.md).

### Où placer un nouveau script?

- Script lié à une scène spécifique: au plus proche de la scène dans `scenes/...`
- Script transverse/réutilisable: `scripts/...`
- Service global: `scripts/autoloads/...`

Référence: [Structure des fichiers](./development/guides/file-structure.md).

### Comment gérer les textes affichés aux joueurs?

Toute chaîne visible en jeu doit passer par `tr()`.

Exemple:

```gdscript
title_label.text = tr("UI_MAIN_MENU_TITLE")
```

## Documentation

### Je veux créer une nouvelle page de doc, il y a une convention?

Oui, suivre [Guide d'écriture](./writing-guidelines.md):

- front matter propre
- structure lisible
- exemples concrets
- liens internes vers les pages liées

### Comment vérifier qu'une modif de doc est valide?

Construire le site en local:

```bash
bun run build
```

Si le build passe, la doc est généralement saine (liens, ancres, markdown).

## Outils

### Quels guides sont les plus utiles au quotidien?

- [Directives de code](./development/guides/coding-guidelines.md)
- [Structure des fichiers](./development/guides/file-structure.md)
- [Logger](./development/guides/logger.md)
- [Console debug](./development/guides/console.md)
- [Snippets](./development/guides/snippets.md)

### Dialogic est documenté où?

Dans [Guide Dialogic](./development/guides/dialogic-guide.md).

## Git et collaboration

### Quelle page pour le workflow de branches et de merge?

- [Workflow Git](./git-workflow.md)
- [Guidelines Git](./development/guides/git-guidelines.md)

### Je corrige juste une faute de doc, je dois ouvrir une PR?

Oui. Même pour une petite correction, garder un historique clair des changements est important pour l'équipe.
