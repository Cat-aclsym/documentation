---
title: Console Debug
sidebar_position: 21
description: Créer, typer et exécuter des commandes de console in-game
---

# Console Debug

La console debug permet d'exécuter des commandes en runtime pour tester rapidement des comportements (progression, économie, affichage, outils de QA).

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

```gdscript
## © [2026] A7 Studio. All rights reserved. Trademark.
extends ICommand

func description() -> String:
    return "Set player money for debug sessions"

func get_args() -> Array[Dictionary]:
    return [
        {"name": "amount", "type": ICommand.Types.ARG_INT, "optional": false}
    ]

func _execute(console: Console, args: Array) -> int:
    var amount: int = args[0]
    if amount < 0:
        console.push_error("Amount must be >= 0")
        return ERR_INVALID_PARAMETER

    Global.money = amount
    console.push_info("Money set to %s" % amount)
    return OK
```

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

Types fréquemment utilisés (selon `ICommand.Types`):

- `ARG_INT`
- `ARG_BOOL`
- `ARG_FLOAT`
- `ARG_STRING`
- `ARG_LEVEL`
- `ARG_CHALLENGE`
- `ARG_ENEMY`
- `ARG_TOWER`
- `ARG_ENUM`
- `ARG_COMMAND`

## Arguments dynamiques (sous-commandes)

Quand une commande a des sous-actions (`progression unlock ...`, `progression lock ...`), utiliser `get_args_dynamic(current_args: Array) -> Array[Dictionary]`.

Exemple conceptuel:

```gdscript
func get_args() -> Array[Dictionary]:
    return [
        {"name": "action", "type": ICommand.Types.ARG_ENUM, "optional": false, "values": ["unlock", "lock"]}
    ]

func get_args_dynamic(current_args: Array) -> Array[Dictionary]:
    if current_args.is_empty():
        return []

    var action: String = str(current_args[0])
    if action == "unlock":
        return [{"name": "level_id", "type": ICommand.Types.ARG_LEVEL, "optional": false}]

    if action == "lock":
        return [{"name": "level_id", "type": ICommand.Types.ARG_LEVEL, "optional": false}]

    return []
```

## Exécution depuis le code

Pour déclencher une commande sans saisie manuelle:

```gdscript
Global.console.push_command("set_font_size 24")
Global.console.push_command("set_game_resolution 1280 720")
```

## Bonnes pratiques

- Retourner `OK` en succès et un code d'erreur Godot en échec.
- Valider les arguments avant d'agir.
- Envoyer un feedback utile via la console (succès/erreur).
- Garder les commandes idempotentes quand possible pour faciliter les tests QA.
- Éviter d'appeler des APIs gameplay fragiles sans garde (`is_instance_valid`, vérification de scène active, etc.).

## Erreurs fréquentes à éviter

- Oublier `extends ICommand`
- Retourner un schéma d'arguments incohérent avec `_execute`
- Ne pas gérer les valeurs limites (`-1`, `0`, chaîne vide)
- Modifier de la logique persistante sans passer par `ProgressionManager`

## Exemple complet: commande booléenne

```gdscript
## © [2026] A7 Studio. All rights reserved. Trademark.
extends ICommand

func description() -> String:
    return "Toggle debug collisions"

func get_args() -> Array[Dictionary]:
    return [
        {"name": "enabled", "type": ICommand.Types.ARG_BOOL, "optional": false}
    ]

func _execute(console: Console, args: Array) -> int:
    var enabled: bool = args[0]
    Global.debug_collisions = enabled
    console.push_info("Debug collisions: %s" % enabled)
    return OK
```

## Liens liés

- [Directives de code](./coding-guidelines.md)
- [Logger](./logger.md)
- [Snippets](./snippets.md)
