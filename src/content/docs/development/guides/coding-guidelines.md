---
title: Conventions de code GDScript
description: Standards de style, de nommage et de documentation GDScript (Godot 4.7.2) pour Cat'aclysm
sidebar:
  label: Conventions de code
  order: 1
---

Style et nommage du GDScript (Godot 4.7.2). Les patterns de conception (signaux, ressources, autoloads, pauses) sont dans [Patterns Godot du projet](/documentation/development/guides/godot-patterns/).

## Principes généraux

- Le code, les commentaires et les chaînes littérales sont en anglais, la documentation en français.
- Scripts courts, typés, à responsabilité unique.
- Indentation avec des tabulations.
- Les valeurs de gameplay ne s'écrivent jamais dans un script: elles viennent de `StatsDB` ([Statistiques](/documentation/development/models/stats-model/)).

## En-tête obligatoire

Chaque fichier `.gd` commence par une ligne de copyright, avec l'année 2026:

```gdscript
## © [2026] A7 Studio. All rights reserved. Trademark.
```

## Ordre des sections dans un script

Ordre des sections, avec un tri alphabétique dans chacune:

1. En-tête
2. `class_name` et `extends`
3. `signal` et `enum`
4. `const`
5. Variables exportées (`@export`)
6. Variables publiques
7. Variables `@onready`
8. Fonctions moteur (`_init`, `_ready`, `_process`, `_physics_process`, etc.)
9. Fonctions publiques
10. Fonctions privées

Les sections de fonctions sont séparées par des commentaires. Le code existant utilise `# Public functions` et `# Private functions` (par exemple `debug/console/commands/set_money.gd`), ou `# core`, `# public` et `# private` (par exemple `global.gd`). Les [snippets](/documentation/setup/snippets/) génèrent la première variante.

## Nommage

- Classe: `PascalCase`
- Fonctions/propriétés: `snake_case`
- Constantes: `SCREAMING_SNAKE_CASE`
- Privé: préfixe `_`
- Interfaces: préfixe `I` (`IEnemy`, `ICommand`)
- Nœuds: noms explicites (`AttackTimer`, `PathFollow`, `HealthBar`), `%UniqueName` pour les nœuds importants
- Fichiers d'assets: `snake_case`

Exemple:

```gdscript
class_name ZombieSpawner
extends Node

const MAX_WAVE_DELAY: float = 10.0

@export_range(0.1, 30.0, 0.1) var spawn_interval: float = 1.0

var active_enemies: Array[Node2D] = []

@onready var _spawn_timer: Timer = %SpawnTimer
```

## Typage et signatures

- Types explicites partout (`var x: int = 0`, `for path: String in paths`). L'avertissement `untyped_declaration` est activé dans `project.godot`: il signale toute déclaration sans type.
- Signatures de fonctions toujours typées (paramètres + retour).
- Éviter `Variant` sauf réel besoin d'abstraction.
- Préférer `Callable` pour stocker des callbacks.
- Conteneurs typés, sans génériques imbriqués:
  - `Array[Dictionary]`
  - `Dictionary[String, Array]` (pas `Dictionary[String, Array[String]]`)

Exemple:

```gdscript
func get_enemy_ids() -> Array[String]:
	return _enemies.map(func(enemy: IEnemy) -> String: return enemy.enemy_id)

func run_deferred(action: Callable) -> void:
	await get_tree().process_frame
	action.call()
```

Préférer `await get_tree().process_frame` ou `await get_tree().create_timer(seconds).timeout` à un `Timer` manuel, et `filter()` / `map()` à une boucle manuelle quand c'est plus lisible.

## Signaux

Toute connexion passe par `SignalUtil.connects`, jamais par `.connect()` directement (`core/utilities/signals/signal_util.gd`). Les clés sont `SignalUtil.WHO` (émetteur), `SignalUtil.WHAT` (nom du signal, en chaîne) et `SignalUtil.TO` (callable):

```gdscript
SignalUtil.connects([
	{SignalUtil.WHO: input, SignalUtil.WHAT: "text_changed", SignalUtil.TO: _on_input_text_changed},
	{SignalUtil.WHO: input, SignalUtil.WHAT: "gui_input", SignalUtil.TO: _on_input_gui_input}
])
```

Les signaux remontent, les méthodes descendent ([Patterns Godot](/documentation/development/guides/godot-patterns/#signaux-vers-le-haut-méthodes-vers-le-bas)).

## Documentation GDScript

- `##` pour la documentation, `#` pour les commentaires internes.
- Les méthodes publiques doivent être documentées.
- Utiliser:
  - `## [param name]` pour les paramètres
  - `## [br]` pour un saut de ligne
  - `[codeblock]...[/codeblock]` pour les exemples

Exemple:

```gdscript
## Apply damage to the enemy
## [br]
## [param damage] Amount of damage to apply
## [param damage_type] Type of damage being applied
## [param source] What dealt the damage: a bullet, a tower or a trap
func take_damage(damage: float, damage_type: DamageType, source: Variant = null) -> void:
```

## Exports et données d'édition

Préférer les exports détaillés quand cela améliore l'usage dans l'inspecteur:

- `@export_range`
- `@export_flags`
- `@export_subgroup`

Exemple:

```gdscript
@export_subgroup("Projectile")
@export_range(0.0, 5000.0, 1.0) var speed: float = 800.0
@export_flags("Pierce", "Bounce", "Explode") var behavior_flags: int = 0
```

## Pause

Aucun script ne pose ou ne lit un drapeau de pause: `Global.request_pause(&"source")` et `Global.release_pause(&"source")` ([Patterns Godot](/documentation/development/guides/godot-patterns/#pause-par-source)).

## Ressources et rendu

- `const` + `preload()` pour les ressources statiques, `load()` seulement pour un chemin connu à l'exécution.
- `is_instance_valid()` avant d'utiliser une référence qui peut être libérée.
- `assert()` pour les nœuds obligatoires dans `_ready`.
- Filtre de texture `Nearest` pour tous les sprites pixel art.

## Thème

Les polices, tailles, couleurs, contours et styles de panneau viennent d'une variation de thème (`theme_type_variation`, changée à l'exécution pour un changement d'état), jamais d'un `theme_override_*` ni d'un `add_theme_*_override`. Les marges et les séparations peuvent rester des surcharges de scène. Toute taille est une valeur de `TypeScale`. Un test (`tests/ui/theme/test_theme.gd`) refuse ces surcharges dans `ui/` et `game/`, sauf dans `game_button.gd` ([Interface](/documentation/development/guides/ui/#variations-de-thème)).

## Internationalisation

- Toute chaîne visible par le joueur passe par `tr()` (labels, boutons, messages, tooltips). Les identifiants techniques, logs et noms de commande ne sont pas traduits.
- Format des clés, fichier CSV et choix de la langue: [Traductions et langues](/documentation/development/guides/i18n/).

## Vérifier avant de pousser

`tools/check_scripts.tscn` compile tous les scripts du projet et `tools/smoke_test.tscn` charge les niveaux: [Vérifications headless](/documentation/development/guides/debugging/#vérifications-headless). Les suites gdUnit4 de `tests/` se lancent avec `GdUnitCmdTool.gd` ([Tests](/documentation/development/guides/testing/#lancer-les-tests)). La CI exécute les trois.

## Tests

Un changement de comportement ajoute ou met à jour une suite de `tests/` (fichier `test_<nom>.gd` dans le dossier qui reprend celui de la source). Les mêmes règles de style s'appliquent aux tests. Conventions d'écriture: [Tests](/documentation/development/guides/testing/#conventions).
