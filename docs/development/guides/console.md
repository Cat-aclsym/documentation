---
title: Debug Console
sidebar_position: 20
description: Ingame debug console
---

# Console



## Model

![logger model](/models/console.drawio.svg)


## Créer une commande

1. Créer le script de la commande dans `res://scripts/commands/command_name.gd`.
:::warning
Le nom du script sera le nom de la command à executer en jeu.
:::

2. Utiliser la template suivante afin de completer le script :
```go
## © [2024] A7 Studio. All rights reserved. Trademark.
extends ICommand

# public
## Return le nom de la command
func command_token() -> String:
	return ""


## Return descript de la command
func description() -> String:
	return ""

## Return une list des types d'arguments attendu. e.g [ICommand.Types.ARG_INT, ICommand.Types.ARG_INT]
func expected_args_types() -> Array[ICommand.Types]:
	return []


# private
## Method éxécuté lors de l'appel de la commande.
## Rajouter '_' derrière `console` ou `args` si ils ne sont pas utilisées
## Return <0 en cas d'erreur
func _execute(console: Console, args: Array) -> int:

	return OK
```

## Appeler une commande depuis le code

```go
Global.console.push_command("command_as_string with_args")
```

:::info exemple
```go
Global.console.push_command("set_font_size 24")
Global.console.push_command("set_game_resolution 1280 720")
```
:::