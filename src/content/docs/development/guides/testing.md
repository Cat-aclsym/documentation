---
title: Tests unitaires et outils de mesure
description: Suites gdUnit4, commandes pour les lancer, lecture des rapports, conventions d'écriture, run déterministe et benchmark de combat
sidebar:
  label: Tests
  order: 14
---

Les tests unitaires utilisent [gdUnit4](https://github.com/godot-gdunit-labs/gdUnit4) 6.2.2, embarqué dans `addons/gdUnit4` (plugin activé dans `project.godot`). Deux scènes de `tools/` complètent les tests: un run déterministe d'un niveau (`golden_run`) et un benchmark de combat (`bench_combat`). Les vérifications headless (`check_scripts`, `smoke_test`) sont dans [Outils de debug](/documentation/development/guides/debugging/#vérifications-headless).

`tests/` et `addons/gdUnit4/` sont exclus des exports (`exclude_filter` des presets), comme `tools/*` ([Exporter le jeu](/documentation/setup/exporting/)).

## Organisation

Les suites de `tests/` reprennent l'arborescence des sources: `autoloads/global.gd` est testé par `tests/autoloads/test_global_pause.gd`. Le résumé `Overall Summary` de chaque exécution donne le nombre de cas.

| Dossier | Suites |
|---|---|
| `tests/autoloads/` | `test_global_pause`, `test_progression_manager`, `test_stats_db` |
| `tests/data/` | `test_levels_data`, `test_translations` |
| `tests/core/narrative/` | `test_narrative`, `test_narrative_characters` |
| `tests/core/progression/` | `test_settings_data` |
| `tests/core/utilities/` | `test_json_util`, `test_state_machine`, `signals/test_signal_util` |
| `tests/game/` | `test_entity_stats` |
| `tests/game/buildings/towers/` | `test_inferno_tower`, `test_tower_signals` |
| `tests/game/buildings/traps/` | `test_trap_lifecycle` |
| `tests/game/enemies/` | `test_big_daddy_signals`, `test_enemy_health_bar` |
| `tests/game/level/` | `test_level_flow`, `test_level_pause`, `test_wave_tick_timer` |
| `tests/game/projectiles/` | `test_instant_lightning`, `test_level_end_gate` |
| `tests/ui/components/` | `test_button_effects`, `test_game_button`, `test_game_icon` ([Boutons](/documentation/development/guides/ui/#boutons-gamebutton)) |
| `tests/ui/hud/` | `test_hud` |
| `tests/ui/menus/` | `test_armory_item`, `test_build_selection`, `test_options_menu`, `test_pause_menu`, `test_tower_upgrade_menu` |
| `tests/ui/popups/` | `test_popup_spawner` |
| `tests/support/` | `test_enemies.gd` et `test_dialogic.gd`, des helpers sans cas de test |

`tests/support/test_enemies.gd` (`TestEnemies`) fait apparaître un ennemi sur un chemin droit, sans niveau:

```gdscript
var enemy: IEnemy = await TestEnemies.spawn(self, "default_zombie")
auto_free(enemy.path)
```

## Écrire un test

Une suite est un script `tests/<dossier miroir>/test_<nom>.gd` qui étend `GdUnitTestSuite`. Chaque méthode `test_*` est un cas. `before_test()` et `after_test()` s'exécutent autour de chaque cas, `before()` et `after()` autour de la suite. Extrait de `tests/autoloads/test_global_pause.gd`:

```gdscript
extends GdUnitTestSuite

const CUSTOM_SOURCE: StringName = &"test_custom_source"

var _emitted: Array[bool] = []


func before_test() -> void:
	Global.clear_pauses()
	_emitted.clear()
	SignalUtil.connects([{SignalUtil.WHO: Global, SignalUtil.WHAT: "pause_changed", SignalUtil.TO: _on_pause_changed}])


func after_test() -> void:
	Global.pause_changed.disconnect(_on_pause_changed)
	Global.clear_pauses()


func test_clear_pauses_releases_every_source() -> void:
	Global.request_pause(CUSTOM_SOURCE)
	Global.request_pause(Global.TREE_PAUSING_SOURCES[0])

	Global.clear_pauses()

	assert_bool(Global.paused).is_false()
	assert_bool(Global.is_time_frozen()).is_false()
	assert_bool(get_tree().paused).is_false()
```

Un cas qui attend des images ou des signaux est asynchrone (`await`). Extrait de `tests/game/test_entity_stats.gd`:

```gdscript
func test_every_trap_scene_gets_its_stats_from_the_json() -> void:
	var problems: Array[String] = []
	for id: String in StatsDB.get_trap_ids():
		var scene: PackedScene = load(StatsDB.get_trap(id)["scene"])
		var trap: ITrap = auto_free(scene.instantiate())
		add_child(trap)
		problems.append_array(_mismatches(trap, id, StatsDB.get_trap(id)["base"]))

	assert_array(problems).is_empty()
```

## Conventions

- **Restaurer l'état global dans `after_test()`.** Les autoloads vivent pendant toute la session de tests: un état laissé par un cas fausse les suivants. Selon la suite, `after_test()` remet `Global.clear_pauses()`, `Engine.time_scale = 1.0`, `ILevel.current_level = null`, `ProgressionManager.data` et `persistence_enabled`, la langue (`TranslationServer.set_locale`) ou la timeline Dialogic.
- **`ProgressionManager.persistence_enabled = false`** dans `before_test()` de toute suite qui touche la progression: sans cela, `save_game()` écrirait `user://progression.dat`. La suite sauvegarde les valeurs d'origine (`ProgressionManager.data`, `persistence_enabled`) et les restaure.
- **Pas d'orphelins.** Un nœud créé par le test passe par `auto_free(...)` ou est libéré explicitement (`queue_free()` puis `await node.tree_exited`, comme `after_test()` de `test_level_flow.gd`). gdUnit4 compte les nœuds orphelins et la commande sort avec le code `101` ([Lire les résultats](#lire-les-résultats)).
- **Timeouts.** Un cas qui attend du temps réel ou des signaux déclare un paramètre `timeout` en millisecondes, précédé de `@warning_ignore("unused_parameter")` puisque le paramètre n'est lu que par gdUnit4:

  ```gdscript
  @warning_ignore("unused_parameter")
  func test_an_invalid_transition_is_refused(timeout: int = 30000) -> void:
  ```

- **Un test ne dépend pas du temps réel.** `test_level_flow.gd` arrête le `WaveTickTimer` du niveau puis appelle `_level._process_tick()` à la main, un tick à la fois ([Niveau et carte](/documentation/development/models/level-model/#tick-des-vagues)).
- **Les valeurs de stats viennent de `StatsDB`**, jamais écrites en dur dans un test, comme dans le code du jeu.
- Mêmes règles de style que le reste du projet: types explicites, `SignalUtil.connects` pour les signaux ([Conventions de code](/documentation/development/guides/coding-guidelines/)).

## Lancer les tests

Toutes les suites, avec la commande de la CI:

```bash
godot --headless --path . -s res://addons/gdUnit4/bin/GdUnitCmdTool.gd -a res://tests -c --ignoreHeadlessMode -rd res://reports
```

| Option | Rôle |
|---|---|
| `-a <dossier ou suite>` | Ajoute un dossier ou un fichier de suite à l'exécution |
| `-c` | Va au bout de toutes les suites: par défaut gdUnit4 s'arrête au premier test en échec |
| `--ignoreHeadlessMode` | Autorise le mode `--headless`, refusé par défaut |
| `-rd <dossier>` | Dossier des rapports (`res://reports` ici) |
| `-i <suite ou suite:test>` | Exclut une suite ou un cas |

Une seule suite ou un seul dossier: remplacer `-a res://tests` par son chemin.

```bash
godot --headless --path . -s res://addons/gdUnit4/bin/GdUnitCmdTool.gd -a res://tests/core/utilities/test_state_machine.gd -c --ignoreHeadlessMode -rd res://reports
godot --headless --path . -s res://addons/gdUnit4/bin/GdUnitCmdTool.gd -a res://tests/autoloads -c --ignoreHeadlessMode -rd res://reports
```

Le projet doit avoir été importé au moins une fois (`godot --headless --path . --import`). Dans l'éditeur, le plugin gdUnit4 fournit aussi son propre inspecteur de tests.

## Lire les résultats

Le code de sortie du processus est le résultat:

| Code | Signification |
|---|---|
| `0` | Tous les tests passent |
| `100` | Au moins un test échoue |
| `101` | Aucun échec, mais des nœuds orphelins ont été détectés |
| `103` | Le mode headless n'est pas autorisé (option `--ignoreHeadlessMode` absente) |
| `104` | La version de Godot est trop ancienne pour gdUnit4 |
| `105` | Une erreur de script a été détectée dans une suite |

Les rapports JUnit XML et HTML sont écrits dans `reports/report_N/` (un dossier par exécution, gdUnit4 garde les 20 derniers par défaut). `reports/` est ignoré par Git. En cas d'échec, la CI publie ce dossier en artefact `test-report` ([Intégration continue](/documentation/setup/ci/#job-check)). Le rapport HTML liste chaque cas avec son message d'échec, le rapport JUnit se lit dans n'importe quel outil de CI.

## Run déterministe d'un niveau

`tools/golden_run.tscn` joue un niveau avec un jeu fixe de bâtiments et affiche une ligne JSON, le digest, préfixée par `GOLDEN_DIGEST`. Le run est seedé (`RNG_SEED`) et à fréquence fixe: deux runs du même code donnent le même digest.

```bash
godot --headless --path . --fixed-fps 60 --quit-after 7200 res://tools/golden_run.tscn -- --level=lev.02 --frames=6000
```

| Argument | Rôle |
|---|---|
| `--level=<id>` | Niveau joué, `lev.02` par défaut. `lev.02` à `lev.08` (`lev.01` porte le tutoriel et n'est pas prévu pour ce run) |
| `--frames=<n>` | Nombre d'images après lequel le digest est affiché si le niveau n'est pas fini, 6000 par défaut |

Le run pose neuf tours (tous les projectiles: flèche, zone, feu, perçante, foudre, faisceau) et les cinq pièges, désactive la sauvegarde, marque le tutoriel comme terminé et tous les ennemis comme vus. Il continue 20 images après la fin du niveau pour voir ce qui se passe après l'écran de fin. Le digest contient `challenges`, `coins`, `elapsed_time`, `enemies_alive`, `enemies_in_tree`, `ended`, `escapes`, `frames`, `health`, `kills`, `level`, `spawned`, `trace_hash` (positions et vie de tous les ennemis toutes les 30 images), `traps_left` et `wave`.

**Quand l'utiliser**: avant et après un refactor qui ne doit pas changer le comportement (machine d'états, ciblage, effets, application des stats). Lancer la commande sur la version d'origine, puis sur la version modifiée, sur plusieurs niveaux, et comparer les deux lignes: elles doivent être identiques. Un digest différent signale un changement de comportement, `trace_hash` repère une dérive d'une seule image.

## Benchmark de combat

`tools/bench_combat.tscn` mesure le temps de script d'un combat chargé et affiche une ligne `BENCH_RESULT` (JSON). Des zombies de base à vie quasi infinie parcourent le premier chemin de `lev.02` et sont refaits apparaître quand ils arrivent au bout, pendant que des tours ou des pièges tirent dessus.

```bash
godot --headless --path . --fixed-fps 60 --quit-after 5000 res://tools/bench_combat.tscn -- --enemies=300 --towers=40 --scenario=inferno
```

| Argument | Rôle |
|---|---|
| `--enemies=<n>` | Nombre d'ennemis vivants en permanence (300 par défaut) |
| `--towers=<n>` | Nombre de bâtiments posés (40 par défaut) |
| `--scenario=<nom>` | `arrows` (`bat_01`), `aoe` (`bat_02`), `fire` (`bat_02` amélioré en flèche de feu), `tesla` (`bat_08` amélioré en foudre à rebonds), `inferno` (`bat_09`) ou `traps` (les cinq pièges tour à tour) |

Après 60 images d'échauffement, le benchmark échantillonne 600 images de `Performance.TIME_PHYSICS_PROCESS` et `TIME_PROCESS` et affiche, pour chacun (`physics_ms` et `process_ms`, en millisecondes par image), la moyenne (`mean`), la médiane (`median`) et l'écart-type (`stddev`). Le mode headless ne mesure pas le rendu.

**Quand l'utiliser**: pour valider une optimisation de gameplay. Lancer le même scénario plusieurs fois avant et après le changement, comparer les médianes et regarder l'écart-type: un gain plus petit que l'écart-type n'est pas mesurable. Vérifier aussi que le digest du run déterministe reste identique.

## Bâtiments sans curseur

`tools/tool_buildings.gd` (`ToolBuildings`) place des bâtiments sur une carte sans passer par `BuildPlacement`, avec les mêmes étapes que `BuildPlacement._build` (sans le coût en pièces). Les deux outils s'en servent:

| Méthode statique | Rôle |
|---|---|
| `get_buildable_cells(map)` | Cellules constructibles, les plus proches d'un chemin d'abord. Sans cellule de placement sur la carte (niveaux 3 à 8), les cellules voisines des chemins |
| `get_path_cells(map)` | Cellules couvertes par un chemin, pour les pièges |
| `place_tower(map, tower_id, cell, upgrade_ids)` | Pose une tour active avec ses upgrades appliquées dans l'ordre |
| `place_trap(map, trap_id, cell)` | Pose un piège actif |
| `parse_user_args()` | Lit les arguments `--clé=valeur` donnés après `--` |
