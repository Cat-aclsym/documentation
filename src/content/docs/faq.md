---
title: Questions fréquentes
description: Réponses courtes aux questions les plus fréquentes, avec le lien vers la page qui détaille
sidebar:
  label: FAQ
---

### Je suis nouveau sur le projet, je commence par quoi?

[Présentation](/documentation/introduction/overview/), [Installation](/documentation/introduction/installation/), puis [Conventions de code](/documentation/development/guides/coding-guidelines/) et [Structure du projet](/documentation/development/guides/file-structure/).

### Où placer un nouveau script?

Un script spécifique à une scène reste à côté d'elle (dans `game/...` ou `ui/...`). Une logique sans scène va dans `core/...` ou `ui/components/...`, et un service global dans `autoloads/...`. Voir [Structure du projet](/documentation/development/guides/file-structure/).

### Comment vérifier que le projet compile et démarre?

Trois commandes headless, les mêmes que la CI: `godot --headless --path . --import`, puis `tools/check_scripts.tscn` (compile tous les scripts) et `tools/smoke_test.tscn` (charge le menu principal puis les 8 niveaux). Voir [Vérifications headless](/documentation/development/guides/debugging/#vérifications-headless).

### Un uid ou un chemin renommé n'est plus trouvé, que faire?

Un `.godot/uid_cache.bin` périmé associe des uids à d'anciens chemins. Le déplacer hors de `.godot/` puis relancer l'import: [Cache d'uid périmé](/documentation/development/guides/debugging/#cache-duid-périmé).

### Comment ajouter une commande de debug?

Créer un script dans `res://debug/console/commands/` qui étend `ICommand`: [Créer une commande](/documentation/development/guides/console-commands/).

### Comment logger un événement?

`Log.trace(Log.Level.INFO, "message")` au lieu de `print()`: [Logs](/documentation/development/guides/logger/).

### Comment afficher un texte au joueur?

Toute chaîne visible passe par `tr()` avec une clé de `assets/translations/translations.csv`:

```gdscript
play_button.text = tr("HOME.PLAY.BUTTON")
```

### Comment créer une page de documentation?

Suivre [Rédiger la documentation](/documentation/contributing/writing-guidelines/), puis lancer `bun run build` pour valider les liens et les ancres.

### Quelle branche et quelles conventions pour une modification?

Voir [Branches Git](/documentation/contributing/git-workflow/) et [Conventions Git](/documentation/contributing/git-guidelines/). Toute modification passe par une pull request, même une correction de faute.
