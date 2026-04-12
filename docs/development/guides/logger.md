---
title: Logger
sidebar_position: 20
description: Système de logs runtime et debug de Cat'aclysm
---

# Logger

Le système de logs centralise les messages techniques du projet et les redirige vers plusieurs sorties.

Code source principal: `res://scripts/log/log.gd`.

## API utilisée dans le projet

Méthode standard:

```gdscript
Log.trace(Log.Level.INFO, "Wave started")
```

La méthode accepte un message simple ou une liste de fragments selon les besoins d'affichage.

## Niveaux de log

- `Log.Level.DEBUG`
- `Log.Level.INFO`
- `Log.Level.WARN`
- `Log.Level.ERROR`
- `Log.Level.FATAL`

Exemples:

```gdscript
Log.trace(Log.Level.DEBUG, "Spawn tick")
Log.trace(Log.Level.WARN, "Missing file: %s" % file_path)
Log.trace(Log.Level.ERROR, ["Cannot load wave id ", wave_id])
```

## Format de sortie

Format général:

```log
[LEVEL] hh:mm:ss.ms - path/to/script::line@method_name - message
```

Exemple:

```log
[ INFO] 13:19:39.485 - res://scripts/log/log.gd::27@init - Logger initialized!
```

## Où vont les logs?

Les logs sont redirigés vers:

1. La console standard Godot
2. La console debug in-game (voir [Console](./console.md))
3. Un fichier dans `res://log/`

Nommage des fichiers de session:

- `YYYY_MM_DD-hh_mm.log`
- exemple: `2026_04_12-18_43.log`

## Filtrage DEBUG

Si `Global.debug` est à `false` dans `res://scripts/autoloads/global.gd`, les logs `DEBUG` ne sont pas affichés.

Cette règle permet de garder une sortie propre en build non debug.

## Bonnes pratiques

- Un message doit aider à diagnostiquer rapidement un problème.
- Ajouter du contexte utile (id, état, ressource, valeur).
- Utiliser le bon niveau (`WARN` pour un comportement dégradé, `ERROR` pour un échec, `FATAL` pour un problème bloquant).
- Éviter le spam dans `_process` sans garde.

Exemple recommandé:

```gdscript
if wave_data == null:
    Log.trace(Log.Level.ERROR, "Wave data is null for id: %s" % wave_id)
    return
```

Exemple à éviter:

```gdscript
Log.trace(Log.Level.INFO, "ok")
```

## Snippet IDE

Pour accélérer l'écriture, utiliser le snippet décrit dans [Snippets](./snippets.md).

## Liens liés

- [Directives de code](./coding-guidelines.md)
- [Console](./console.md)
