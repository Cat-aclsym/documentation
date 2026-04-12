---
title: Directives de code
sidebar_position: 1
description: Standards GDScript Godot 4.4 pour Cat'aclysm
---

# Directives de code (Godot 4.4)

Cette page définit les conventions de développement GDScript pour Cat'aclysm: Claw of the Dead.
L'objectif est simple: garder une base de code lisible, maintenable et cohérente entre gameplay, UI, outils et debug.

## Principes généraux

- Le projet cible Godot 4.4.
- Le code, les commentaires et les noms techniques sont en anglais.
- La documentation de l'équipe est en français.
- Toute chaîne visible par le joueur passe par `tr()`.
- On favorise des scripts courts, typés et orientés responsabilité unique.

## En-tête obligatoire

Chaque fichier `.gd` doit commencer par:

```gdscript
## © [2026] A7 Studio. All rights reserved. Trademark.
```

Exemple minimal:

```gdscript
## © [2026] A7 Studio. All rights reserved. Trademark.

class_name DamagePopup
extends Node2D
```

## Ordre des sections dans un script

Respecter cet ordre (et garder un tri alphabétique quand c'est possible dans une section):

1. En-tête
2. `class_name` et `extends`
3. `signal` et `enum`
4. `const`
5. Variables exportées
6. Variables publiques
7. Variables `@onready`
8. Fonctions moteur (`_init`, `_ready`, `_process`, `_physics_process`, etc.)
9. Fonctions publiques
10. Fonctions privées

## Nommage

- Classe: `PascalCase`
- Fonctions/propriétés: `snake_case`
- Constantes: `SCREAMING_SNAKE_CASE`
- Privé: préfixe `_`
- Interfaces: préfixe `I` (`IEnemy`, `ICommand`)
- Nœuds: noms explicites (`AttackTimer`, `PathFollow`, `HealthBar`)

Exemple:

```gdscript
class_name EnemySpawner
extends Node

const MAX_WAVE_DELAY: float = 10.0

@export_range(0.1, 30.0, 0.1) var spawn_interval: float = 1.0

var active_enemies: Array[Node2D] = []

@onready var _spawn_timer: Timer = %SpawnTimer
```

## Typage et signatures

- Types explicites par défaut (`var x: int = 0`).
- Signatures de fonctions toujours typées (paramètres + retour).
- Éviter `Variant` sauf réel besoin d'abstraction.
- Préférer `Callable` pour stocker des callbacks.
- Préférer les types de conteneurs compatibles Godot 4.4, par exemple:
  - `Array[Dictionary]`
  - `Dictionary[String, Array]`

Exemple:

```gdscript
func get_enemy_ids() -> Array[int]:
    return _enemies.map(func(enemy: IEnemy) -> int: return enemy.enemy_id)

func run_deferred(action: Callable) -> void:
    await get_tree().process_frame
    action.call()
```

## Documentation GDScript

- `##` pour la documentation, `#` pour les commentaires internes.
- Les méthodes publiques doivent être documentées.
- Utiliser:
  - `## [param name]` pour les paramètres
  - `## [br]` pour un saut de ligne
  - `[codeblock]...[/codeblock]` pour les exemples

Exemple:

```gdscript
## Inflige des dégâts à l'ennemi et applique les effets associés.
## [param amount] Dégâts entrants.
## [param damage_type] Type de dégâts (feu, poison, etc.).
## [br]
## [codeblock]
## enemy.take_damage(15, IEnemy.DamageType.FIRE)
## [/codeblock]
func take_damage(amount: int, damage_type: int) -> void:
    pass
```

## Accès nœuds et sécurité runtime

- Préférer `@onready` et `%UniqueName` pour les nœuds importants.
- Vérifier les dépendances en `_ready()` avec `assert(...)`.
- Avant d'utiliser une référence potentiellement libérée: `is_instance_valid()`.

Exemple:

```gdscript
@onready var _health_bar: TextureProgressBar = %HealthBar

func _ready() -> void:
    assert(_health_bar != null, "HealthBar node is required")

func set_target(target: Node2D) -> void:
    if not is_instance_valid(target):
        Log.trace(Log.Level.WARN, "Invalid target reference")
        return
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

## Couplage, signaux et architecture

- Règle: signaux vers le haut, appels de méthodes vers le bas.
- Favoriser les scènes préconstruites plutôt que créer des nœuds dynamiquement sans nécessité.
- `class_name` requis pour les types réutilisés dans plusieurs systèmes.

Exemple de connexion via utilitaire:

```gdscript
const SIGNALS: Array[Dictionary] = [
    {SignalUtil.WHO: self, SignalUtil.WHAT: "die", SignalUtil.TO: _on_enemy_die}
]

func _ready() -> void:
    SignalUtil.connect(SIGNALS)
```

## Ressources

- Ressources statiques: `const X = preload("...")`
- Ressources dynamiques (chemin déterminé à runtime): `load()`

Exemple:

```gdscript
const ZOMBIE_SCENE: PackedScene = preload("res://scenes/gameplay/entities/enemy/enemies/zombie.tscn")

func load_skin(path: String) -> Texture2D:
    return load(path) as Texture2D
```

## Services globaux (autoload)

Autoloads principaux du projet:

- `Global`
- `SoundManager`
- `ScenesLoader`
- `StatsDB`
- `ProgressionManager`
- `ChallengeManager`
- `Log`

Bonnes pratiques:

- Vérifier l'initialisation avant usage si nécessaire.
- Ne pas surcharger les autoloads avec de la logique métier locale.

## Systèmes importants

### Entités

- Les ennemis héritent de `IEnemy`.
- Utiliser un enum d'état + `match state` quand adapté.
- Signaux usuels: `die`, `camera_effect`.
- Les overrides de stats passent par `StatsDB`.

### Logging

API standard:

```gdscript
Log.trace(Log.Level.WARN, "Missing file: %s" % file_path)
```

Niveaux:

- `Log.Level.DEBUG`
- `Log.Level.INFO`
- `Log.Level.WARN`
- `Log.Level.ERROR`
- `Log.Level.FATAL`

### Console debug

- Les commandes sont dans `scripts/commands/`.
- Une commande doit `extends ICommand` et implémenter:
  - `description() -> String`
  - `get_args() -> Array[Dictionary]`
  - `_execute(console: Console, args: Array) -> int`

Exemple d'argument:

```gdscript
[
    {"name": "amount", "type": ICommand.Types.ARG_INT, "optional": false}
]
```

### State machine

- Utiliser `StateMachine`, `State`, `Transition` pour les comportements à transitions explicites.
- Changer d'état avec `toggle_state(state_id)`.

### UI

- Hériter de `CanvasLayer` ou `Control`.
- Pour les UI persistantes, enregistrer la référence dans `Global`.
- Toutes les chaînes affichées joueur passent par `tr()`.

## Internationalisation

Règles:

- Toujours traduire les labels, boutons, messages, tooltips et erreurs UI.
- Ne pas traduire les identifiants techniques, logs internes ou tokens de commande.

Exemple:

```gdscript
title_label.text = tr("UI_SETTINGS_TITLE")
confirm_button.text = tr("UI_CONFIRM")
```

## Pixel art

- Utiliser le filtrage `Nearest` pour les sprites pixel art.
- Garder des réglages d'import cohérents pour éviter le flou visuel.

## Checklist de review rapide

- En-tête copyright présent
- Script ordonné selon la convention
- Types explicites sur variables et fonctions
- Méthodes publiques documentées
- Chaînes joueur en `tr()`
- Dépendances critiques validées (`assert` / garde)
- Logs via `Log.trace(...)`
- Interfaces respectées (`IEnemy`, `ICommand`, etc.)

## Références liées

- [Structure des fichiers](./file-structure.md)
- [Logger](./logger.md)
- [Console](./console.md)
- [Git Guidelines](./git-guidelines.md)
- [Workflow Git](../../git-workflow.md)
