---
title: Système de logs
description: Utiliser Log.trace, niveaux, format de sortie et emplacement des fichiers de logs
sidebar:
  label: Logs
  order: 10
---

Le système de logs est la classe statique `Log` (`res://scripts/log/log.gd`). Elle remplace `print()` pour tout message technique.

```gdscript
Log.trace(Log.Level.INFO, "Wave started")
Log.trace(Log.Level.WARN, "Missing file: %s" % file_path)
Log.trace(Log.Level.ERROR, ["Cannot load wave id", wave_id])
```

`Log.trace` accepte un message simple ou une liste de fragments, joints par un espace. `Log.init()` est appelé une seule fois, par l'autoload `Global`.

```mermaid
classDiagram
    class Log
    class Level["Log.Level"] {
        <<enumeration>>
    }
    Log --> Level
    Log ..> Console : push_text
    Log ..> Global : debug
```

| Membre statique de `Log` | Rôle |
|---|---|
| `init()` | crée le fichier de logs, appelé une fois par `Global` |
| `trace(level, args)` | formate et publie un message |
| `save_message(message)` | ajoute le message au fichier, sans effet si le fichier n'existe pas |
| `PREFIXS` | préfixe affiché pour chaque niveau |

## Niveaux

`WARN` signale un comportement dégradé, `ERROR` un échec qui n'arrête pas le jeu, `FATAL` un problème bloquant. `DEBUG` n'est affiché que si `Global.debug` vaut `true`, c'est-à-dire dans l'éditeur et les exports debug (`OS.has_feature("debug")`).

## Format de sortie

```log
[LEVEL] h:m:s.ms - fichier.gd::ligne@fonction - message
```

Le fichier est indiqué par son nom seul, et l'heure n'est pas complétée par des zéros. Le champ `ms` vaut `Time.get_ticks_msec() % 1000`: les millisecondes écoulées depuis le démarrage du moteur, pas celles de l'horloge.

```log
[ INFO] 13:19:39.485 - log.gd::47@init - Logger initialized!
```

## Sorties

Chaque message part vers:

1. la sortie standard de Godot (`print`);
2. la [console de debug](/documentation/development/guides/console/), si elle existe;
3. un fichier `res://log/YYYY_MM_DD-hh_mm.log`, créé au démarrage (par exemple `2026_04_12-18_43.log`).

Le dossier `log/` est ignoré par Git. `res://` n'est pas modifiable dans un export (Android compris): les fichiers de logs n'existent donc que quand le jeu tourne depuis l'éditeur. Sur un téléphone, lire la sortie Godot ([Test sur Android](/documentation/setup/android-testing/)).

## Écrire de bons logs

- Ajouter le contexte utile (id, état, valeur): `"Wave data is null for id: %s" % wave_id` plutôt que `"ok"`.
- Éviter de logger à chaque frame dans `_process`.

Le snippet de l'IDE génère l'appel ([Snippets](/documentation/setup/snippets/)).
