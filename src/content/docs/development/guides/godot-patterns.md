---
title: Patterns Godot du projet
description: Signaux, chargement des ressources, vérifications au démarrage, pauses par source et accès aux services globaux dans Cat'aclysm
sidebar:
  label: Patterns Godot
  order: 4
---

Cette page décrit les patterns de code Godot appliqués dans le projet. Le style et le nommage sont dans [Conventions de code](/documentation/development/guides/coding-guidelines/), les autoloads, signaux et factories dans [Architecture et patterns](/documentation/development/guides/architecture/).

## Signaux vers le haut, méthodes vers le bas

- Un parent appelle les méthodes de ses enfants.
- Un enfant informe son parent par un signal, sans connaître son parent.
- Favoriser les scènes préconstruites plutôt que créer des nœuds dynamiquement sans nécessité (sauf besoin réel au runtime, comme des particules dynamiques).
- `class_name` est requis pour les types réutilisés dans plusieurs systèmes.
- Toute connexion passe par `SignalUtil.connects` ([Architecture](/documentation/development/guides/architecture/#observer)), jamais par `.connect()`.

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

- Ressources statiques: `const X: PackedScene = preload("...")`
- Ressources dynamiques, dont le chemin est déterminé à l'exécution: `load()`

```gdscript
const SMALL_ZOMBIE_SCENE: PackedScene = preload("res://scenes/gameplay/entities/enemy/enemies/small_zombie.tscn")

func load_skin(path: String) -> Texture2D:
	return load(path) as Texture2D
```

## Accès au `Global`

L'autoload `Global` (`scripts/autoloads/global.gd`) expose les références `camera`, `console`, `cursor`, `hud` et `ui`, la variable `debug` et la pause par source.

- Les références valent `null` tant que leur nœud n'est pas prêt, et peuvent pointer vers un nœud libéré après un changement de scène: vérifier avec `is_instance_valid()` avant usage.
- `Global.debug` vaut `OS.has_feature("debug")`: voir [Logs, niveaux](/documentation/development/guides/logger/#niveaux).
- Ne pas surcharger les autoloads avec de la logique métier locale.

`Log` n'est pas un autoload: c'est une classe (`class_name Log`) avec des méthodes statiques.

## Pause par source

Aucun code ne pose ni ne lit de drapeau de pause. Chaque système demande une pause en son nom, et le jeu reprend quand toutes les sources l'ont relâchée:

```gdscript
Global.request_pause(&"upgrade_menu")
# ...
Global.release_pause(&"upgrade_menu")
```

| Membre de `Global` | Rôle |
|---|---|
| `request_pause(source: StringName)` | pause au nom de `source`, une seconde demande de la même source compte pour une |
| `release_pause(source: StringName)` | relâche la pause de `source` |
| `clear_pauses()` | oublie toutes les sources, appelé quand un niveau est remplacé ou quitté |
| `paused: bool` | lecture seule, `true` tant qu'une source est active |
| `is_time_frozen() -> bool` | `true` quand une source impose un `Engine.time_scale` à 0 |
| `pause_changed(paused: bool)` | signal émis à chaque demande ou relâchement |
| `TREE_PAUSING_SOURCES` | sources qui mettent aussi l'arbre de scène en pause: `&"dialogue"`, `&"new_enemy"`, `&"pause_menu"`, `&"tutorial"` |
| `TIME_RUNNING_SOURCES` | sources qui laissent tourner `Engine.time_scale` (elles jouent leurs propres animations): `&"dialogue"`, `&"level_end"`, `&"new_enemy"`, `&"tutorial"` |

Les autres sources (`&"tower_info"`, `&"upgrade_menu"`...) gèlent seulement le gameplay. `ScenesLoader.go_home()` et `ScenesLoader.start_level()` appellent `clear_pauses()`. `ILevel` applique la pause immédiatement, y compris pendant l'état `CONFIGURING`.

## Entités, états et interface

- Les ennemis héritent de `IEnemy`, les tours de `ITower`, les pièges de `ITrap`.
- Leurs statistiques viennent de `StatsDB`, jamais d'une valeur écrite dans le script.
- Les comportements à transitions explicites utilisent `StateMachine` (`toggle_state(state_id)`), voir [Architecture](/documentation/development/guides/architecture/#factory).
- Une UI persistante enregistre sa référence dans `Global`.
- Les logs passent par `Log.trace(...)` ([Logs](/documentation/development/guides/logger/)), les commandes de debug étendent `ICommand` ([Créer une commande](/documentation/development/guides/console-commands/)).
