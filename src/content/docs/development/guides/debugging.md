---
title: Outils de debug
description: Ce qui n'existe qu'en debug, les vérifications headless, les écrans de test et les raccourcis pour tester un niveau
sidebar:
  label: Outils de debug
  order: 13
---

Les outils de debug dépendent tous de `Global.debug`, qui vaut `OS.has_feature("debug")`: `true` dans l'éditeur et dans un export debug, `false` dans un export release. La valeur ne peut pas être modifiée une fois le jeu initialisé.

| Outil | Comportement en release |
|---|---|
| [Console](/documentation/development/guides/console/) | La scène se supprime au démarrage |
| `Log.trace` au niveau `DEBUG` | Le message est ignoré ([Logs](/documentation/development/guides/logger/#niveaux)) |
| Bouton `debug: stats icons` du menu d'accueil | Reste masqué |

## Vérifications headless

Deux scènes de `tools/` vérifient le projet sans fenêtre. Elles sont exclues des exports (`tools/*`, comme `tests/*` et `addons/gdUnit4/*`, dans le filtre d'exclusion des presets) et la [CI](/documentation/setup/ci/) les lance dans cet ordre, après l'import:

```bash
godot --headless --path . --import
godot --headless --path . --quit-after 3000 res://tools/check_scripts.tscn
godot --headless --path . --quit-after 6000 res://tools/smoke_test.tscn
```

Dans les deux cas, le code de sortie du processus est le résultat: `0` si tout va bien. Ce sont des scènes et non l'option `--check-only` de Godot, car `--check-only` charge les scripts sans les autoloads (`Global`, `StatsDB`, `Log`...) dont ils dépendent.

### `tools/check_scripts.tscn`

`tools/check_scripts.gd` parcourt `res://` récursivement (sauf `res://addons`, `res://.godot`, `res://android` et `res://exports`), charge chaque fichier `.gd` avec `load()` et signale un échec quand le script est `null`, ou quand il ne peut pas être instancié sans être abstrait. Chaque échec s'affiche (`FAILED: res://...`), puis le bilan et la sortie:

```text
Checked N scripts, 0 failed.
```

Le code de sortie est le nombre d'échecs. L'avertissement `untyped_declaration` ne fait pas échouer la vérification.

### `tools/smoke_test.tscn`

`tools/smoke_test.gd` joue le jeu quelques secondes en accéléré:

1. Il désactive la sauvegarde (`ProgressionManager.persistence_enabled = false`), marque le tutoriel comme terminé et plafonne le jeu à 60 images par seconde.
2. Il instancie `res://main.tscn` et attend 120 images.
3. Il charge chaque scène `lev.*.tscn` de `res://game/level/levels`, lance le niveau (`start_level()` puis `Global.ui.start_level()`, comme le menu de sélection et la commande `load_level`), le fait tourner 240 images avec `Engine.time_scale = 8.0`, puis le libère.
4. Il compte chaque erreur journalisée par le moteur grâce à un `Logger` (`OS.add_logger`): `push_error`, chargement raté, erreur de script ou de shader. Les avertissements sont ignorés, ainsi que l'erreur `not supported in Dummy renderer` que chaque shader produit en `--headless`.

La sortie résume le run (`Smoke test: 8 levels, 0 errors.`), après avoir listé au plus 20 erreurs (`ERROR: fichier:ligne @ fonction: ...`). Le code de sortie est le nombre d'erreurs, plafonné à 255.

Un garde-fou (`FRAME_BUDGET`, 5500 images) termine le test en erreur avant la limite `--quit-after 6000` de la CI: une erreur de script dans la coroutine l'interromprait sans bruit, et le processus se terminerait sinon avec le code `0`.

### Cache d'uid périmé

Après un renommage ou un déplacement d'assets, `.godot/uid_cache.bin` peut associer des uids à d'anciens chemins: les scènes ne trouvent plus leurs ressources. Déplacer ce fichier hors de `.godot/` puis relancer l'import (`godot --headless --path . --import`) le régénère. La CI met seulement `.godot/imported` en cache pour la même raison ([Intégration continue](/documentation/setup/ci/#job-check)).

### Tests unitaires et mesures

Les suites gdUnit4 de `tests/` se lancent avec `GdUnitCmdTool.gd` (étape « Unit tests » de la CI). `tools/golden_run.tscn` (digest JSON déterministe d'un niveau, pour vérifier qu'un refactor ne change pas le comportement) et `tools/bench_combat.tscn` (médiane et écart-type du temps de script d'un combat chargé) servent aux refactors et aux optimisations. Tout est décrit dans [Tests unitaires et outils de mesure](/documentation/development/guides/testing/).

## Écrans de test

**Icônes de stats** (`debug/stats_icons_debug.tscn`): depuis le menu d'accueil, le bouton `debug: stats icons` ouvre la liste (ou la grille) de toutes les icônes de stats avec leur clé. Utile pour vérifier une nouvelle stat dans `StatBar`. Pour tester une tour ou un ennemi isolé, lancer un niveau avec `load_level` puis utiliser les commandes ci-dessous.

**Galerie des boutons** (`debug/game_button_gallery.tscn`): affiche chaque forme de `GameButton` avec chaque palette, les boutons textuels, les bascules, les états désactivés et tous les glyphes de `GameIcon`. Elle se lance seule (`godot --path . res://debug/game_button_gallery.tscn`), voir [Boutons](/documentation/development/guides/ui/#boutons-gamebutton).

## Tester un niveau

Les commandes de la [console](/documentation/development/guides/console/#commandes-disponibles) évitent de rejouer un niveau:

| Besoin | Commande |
|---|---|
| Lancer un niveau précis | `load_level lev.05` |
| Avoir des pièces | `set_money 5000` |
| Accélérer ou ralentir | `set_time_scale 3` |
| Voir où poser une tour | `debug_tower_placement` ([Construction](/documentation/development/guides/building-placement/#tuiles-de-placement)) |
| Améliorer ou vendre une tour | `up`, `sell` |
| Débloquer l'armurerie, un niveau, un défi | `unlock_armory`, `progression` |
| Chercher une fuite de nœuds | `orphans` |

`IMap.debug_show_spawnable_special_tiles` (export dans l'inspecteur de la carte) affiche les tuiles éligibles aux bonus et malus.

## Sorties

- Le projet est lancé avec l'argument `--verbose` depuis l'éditeur (`editor/run/main_run_args` dans `project.godot`).
- Les logs sont écrits dans `res://log`, donc seulement depuis l'éditeur. Sur un téléphone, seule la sortie de Godot les montre ([Test sur Android](/documentation/setup/android-testing/)).
- Pour la performance, utiliser le profileur et les moniteurs de l'éditeur Godot: le projet n'a pas d'outil de profilage dédié.
