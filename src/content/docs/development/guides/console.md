---
title: Console Debug
description: Créer, typer et exécuter des commandes de console in-game
sidebar:
  order: 21
---

La console debug permet d'exécuter des commandes en runtime pour tester rapidement des comportements (progression, économie, affichage, outils de QA).

## Utilisation

- La touche `` ` `` (action `toggle_console`) ouvre et ferme la console.
- `Entrée` (action `console_push`) exécute la commande saisie.
- La commande `help` liste les commandes disponibles.

## Emplacement des scripts

- Interface de base: `res://scenes/utilities/console/icommand.gd`
- Implémentations: `res://scripts/commands/`

Convention importante:

- Le nom du fichier correspond au token de commande tapé en jeu.
- Exemple: `set_money.gd` expose la commande `set_money`.

## Contrat minimal d'une commande

Chaque commande:

1. `extends ICommand`
2. Implémente `description() -> String`
3. Implémente `get_args() -> Array[Dictionary]`
4. Implémente `_execute(console: Console, args: Array) -> int`

## Structure recommandée

Exemple réel, `scripts/commands/set_money.gd`:

```gdscript
## © [2024] A7 Studio. All rights reserved. Trademark.
extends ICommand


# Public functions
func description() -> String:
	return "Sets the current amount of coins available to the player."


func get_args() -> Array[Dictionary]:
	return [{"name": "amount", "type": Types.ARG_INT}]


# Private functions
func _execute(console: Console, args: Array) -> int:
	if not ILevel.current_level:
		console.push_error_("You must be in a level to use this command.")
		return ERR_UNKNOWN_BEHAVIOR

	var amount: int = int(args[0])
	if amount < 0:
		console.push_error_("Money amount cannot be negative.")
		return ERR_UNKNOWN_BEHAVIOR

	ILevel.current_level.coins = amount
	console.push_text("Set coins to: %d" % amount)

	return OK
```

Les pièces appartiennent au niveau en cours: toujours vérifier `ILevel.current_level` avant d'y accéder.

## Schéma d'arguments

`get_args()` renvoie une liste de dictionnaires:

```gdscript
[
	{
		"name": "arg_name",
		"type": ICommand.Types.ARG_STRING,
		"optional": false
	}
]
```

Types disponibles (`ICommand.Types`):

- `ARG_INT`
- `ARG_BOOL`
- `ARG_FLOAT`
- `ARG_STRING`
- `ARG_LEVEL`
- `ARG_CHALLENGE`
- `ARG_ENEMY`
- `ARG_TOWER`
- `ARG_INGAME_TOWER`
- `ARG_ENUM`
- `ARG_COMMAND`

Pour `ARG_ENUM`, la clé `enum_values` liste les valeurs acceptées.
`is_variable_args()` retourne `true` pour les commandes à nombre d'arguments libre: la validation du nombre d'arguments est alors ignorée.

## Arguments dynamiques (sous-commandes)

Quand les arguments dépendent des précédents (`progression unlock tower ...`), surcharger `get_args_dynamic(current_args: Array) -> Array[Dictionary]`.
Extrait de `scripts/commands/progression.gd`:

```gdscript
func get_args_dynamic(current_args: Array) -> Array[Dictionary]:
	var action_arg := {"name": "action", "type": Types.ARG_ENUM, "enum_values": ["armory", "challenge", "reset", "show", "unlock"]}

	if current_args.is_empty():
		return [action_arg]

	var args: Array[Dictionary] = [action_arg]
	var subcommand: String = current_args[0]

	match subcommand:
		# ... branches "armory" et "unlock"
		"challenge":
			args.append({"name": "level_id", "type": Types.ARG_LEVEL})
			args.append({"name": "challenge_id", "type": Types.ARG_CHALLENGE})

	return args
```

## Exécution depuis le code

Pour déclencher une commande sans saisie manuelle:

```gdscript
Global.console.push_command("set_font_size 24")
Global.console.push_command("set_game_resolution 1280 720")
```

## Sortie console

- `console.push_text(text)`: texte simple.
- `console.push_color(text, color)`: texte coloré.
- `console.push_error_(text)`: message d'erreur (le nom finit par `_`).
- `console.push_debug(text)`: message de debug en vert.

## Codes de retour

- `OK` en succès.
- `ERR_UNKNOWN_BEHAVIOR`: échec métier signalé par la commande.
- `ERR_INVALID_ARGS_TYPES` et `ERR_INVALID_ARGS_COUNT`: renvoyés par `ICommand.execute` quand la validation des arguments échoue.

## Bonnes pratiques

- Retourner `OK` en succès et un code d'erreur en échec.
- Valider les arguments avant d'agir.
- Envoyer un feedback utile via la console (succès/erreur).
- Garder les commandes idempotentes quand possible pour faciliter les tests QA.
- Éviter d'appeler des APIs gameplay fragiles sans garde (`is_instance_valid`, vérification de scène active, etc.).

## Erreurs fréquentes à éviter

- Oublier `extends ICommand`
- Retourner un schéma d'arguments incohérent avec `_execute`
- Ne pas gérer les valeurs limites (`-1`, `0`, chaîne vide)
- Modifier de la logique persistante sans passer par `ProgressionManager`

## Exemple complet: commande à argument flottant

Extrait de `scripts/commands/set_time_scale.gd`:

```gdscript
## © [2024] A7 Studio. All rights reserved. Trademark.
extends ICommand


# Public functions
func description() -> String:
	return "Adjusts the game's simulation speed (1.0 is normal speed)."


func get_args() -> Array[Dictionary]:
	return [{ "name": "timescale", "type": ICommand.Types.ARG_FLOAT, "optional": false }]


# Private functions
func _execute(console: Console, args: Array) -> int:
	var timescale: float = float(args[0])
	if timescale <= 0.0:
		console.push_error_("Time scale must be positive.")
		return ERR_UNKNOWN_BEHAVIOR

	Engine.time_scale = timescale
	console.push_text("Set time scale to: %.2f" % timescale)

	return OK
```

## Liens liés

- [Directives de code](/documentation/development/guides/coding-guidelines/)
- [Logger](/documentation/development/guides/logger/)
- [Snippets](/documentation/development/guides/snippets/)
