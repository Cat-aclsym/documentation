---
title: Patterns Godot du projet
description: Signaux, chargement des ressources, vérifications au démarrage et accès aux services globaux dans Cat'aclysm
sidebar:
  label: Patterns Godot
  order: 4
---

Cette page décrit les patterns de code Godot appliqués dans le projet. Le style et le nommage sont dans [Conventions de code](/documentation/development/guides/coding-guidelines/), les autoloads, signaux et factories dans [Architecture et patterns](/documentation/development/guides/architecture/).

## Signaux vers le haut, méthodes vers le bas

- Un parent appelle les méthodes de ses enfants.
- Un enfant informe son parent par un signal, sans connaître son parent.
- Favoriser les scènes préconstruites plutôt que créer des nœuds dynamiquement sans nécessité.
- `class_name` est requis pour les types réutilisés dans plusieurs systèmes.
- Préférer `SignalUtil.connects` à `.connect()` ([Architecture](/documentation/development/guides/architecture/#observer)). Le code existant contient encore des appels directs à `.connect()`.

## Accès aux nœuds et vérifications

- Préférer `@onready` et `%UniqueName` pour les nœuds importants.
- Vérifier les nœuds obligatoires en `_ready()` avec `assert(...)`.
- Avant d'utiliser une référence potentiellement libérée: `is_instance_valid()`.

```gdscript
@onready var _health_bar: TextureProgressBar = %HealthBar

func _ready() -> void:
	assert(_health_bar != null, "HealthBar node is required")

func set_target(target: Node2D) -> void:
	if not is_instance_valid(target):
		Log.trace(Log.Level.WARN, "Invalid target reference")
		return
```

## Chargement des ressources

- Ressources statiques: `const X = preload("...")`
- Ressources dynamiques, dont le chemin est déterminé à l'exécution: `load()`

```gdscript
const SMALL_ZOMBIE_SCENE: PackedScene = preload("res://scenes/gameplay/entities/enemy/enemies/small_zombie.tscn")

func load_skin(path: String) -> Texture2D:
	return load(path) as Texture2D
```

## Accès au `Global`

L'autoload `Global` (`scripts/autoloads/global.gd`) expose les références `camera`, `console`, `cursor`, `hud` et `ui`, ainsi que les variables `paused` et `debug`.

- Une fois le jeu initialisé, les getters de `camera`, `cursor`, `hud` et `ui` déclenchent un `assert` si la référence est nulle. `console` peut être nulle.
- Vérifier la référence avant usage quand le code peut s'exécuter hors d'un niveau.
- `Global.debug` vaut `OS.has_feature("debug")`: voir [Logs, niveaux](/documentation/development/guides/logger/#niveaux).
- Ne pas surcharger les autoloads avec de la logique métier locale.

`Log` n'est pas un autoload: c'est une classe (`class_name Log`) avec des méthodes statiques.

## Entités, états et interface

- Les ennemis héritent de `IEnemy`, les tours de `ITower`, les pièges de `ITrap`.
- Les comportements à transitions explicites utilisent `StateMachine` (`toggle_state(state_id)`), voir [Architecture](/documentation/development/guides/architecture/#factory).
- Une UI persistante enregistre sa référence dans `Global`.
- Les logs passent par `Log.trace(...)` ([Logs](/documentation/development/guides/logger/)), les commandes de debug étendent `ICommand` ([Créer une commande](/documentation/development/guides/console-commands/)).
