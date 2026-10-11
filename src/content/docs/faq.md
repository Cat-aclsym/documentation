---
title: FAQ
description: Questions fréquentes sur Cat'aclysm et sa documentation
sidebar:
  order: 999
---

## Onboarding

### Je suis nouveau sur le projet. Je commence par quoi?

Ordre recommandé:

1. [Présentation](/documentation/introduction/overview/)
2. [Installation](/documentation/introduction/installation/)
3. [Directives de code](/documentation/development/guides/coding-guidelines/)
4. [Structure des fichiers](/documentation/development/guides/file-structure/)

### Où sont les conventions GDScript officielles du projet?

Dans [Directives de code](/documentation/development/guides/coding-guidelines/).

## Développement

### Où créer une nouvelle commande de debug?

Dans `res://scripts/commands/`, en héritant de `ICommand`.
Voir le guide: [Console debug](/documentation/development/guides/console/).

### Où logger proprement un événement de gameplay?

Utiliser `Log.trace(...)` au lieu de `print()`.
Voir [Logger](/documentation/development/guides/logger/).

### Où placer un nouveau script?

- Script lié à une scène spécifique: au plus proche de la scène dans `scenes/...`
- Script transverse/réutilisable: `scripts/...`
- Service global: `scripts/autoloads/...`

Référence: [Structure des fichiers](/documentation/development/guides/file-structure/).

### Comment gérer les textes affichés aux joueurs?

Toute chaîne visible en jeu doit passer par `tr()`.

Exemple:

```gdscript
title_label.text = tr("UI_MAIN_MENU_TITLE")
```

## Documentation

### Je veux créer une nouvelle page de doc, il y a une convention?

Oui, suivre [Guide d'écriture](/documentation/writing-guidelines/):

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

- [Directives de code](/documentation/development/guides/coding-guidelines/)
- [Structure des fichiers](/documentation/development/guides/file-structure/)
- [Logger](/documentation/development/guides/logger/)
- [Console debug](/documentation/development/guides/console/)
- [Snippets](/documentation/development/guides/snippets/)

### Dialogic est documenté où?

Dans [Guide Dialogic](/documentation/development/guides/dialogic-guide/).

## Git et collaboration

### Quelle page pour le workflow de branches et de merge?

- [Workflow Git](/documentation/git-workflow/)
- [Guidelines Git](/documentation/development/guides/git-guidelines/)

### Je corrige juste une faute de doc, je dois ouvrir une PR?

Oui. Même pour une petite correction, garder un historique clair des changements est important pour l'équipe.
