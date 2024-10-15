---
title: Logger
sidebar_position: 20
description: Ingame debug logger
---

# Logger

Vous pouvez retrouver le code source du logger dans `res://scripts/log/`.


## Model

![logger model](/assets/logger.drawio.svg)


## Utilisation

Pour une utilisation plus efficace du logger, ajouter le [snippet](./snippets.md#trace-log) à votre IDE.
Exemple d'appel :
```go
Log.trace(Log.Level.INFO, "Hello World!")
```

## Outputs

:::warning
Si la variable global `debug` dans le fichier `res://scripts/autoload/global.gd` n'est pas à `true`, aucun log de niveau `Log.Level.Debug` ne sortira.
:::

La sortie se compose comme ceci
```log
[LEVEL] hh:mm:ss.ms - path/to/script::line@method_name - message
```

Par exemple
```log
[ INFO] 13:19:39.485 - res://scripts/log/log.gd::27@init - Logger initialized!
```

Les logs sont redirigés
1. Dans la sortie standard de la console godot
2. Dans la console de debug intégrée à Cat'aclysm _(cf. [console](./console.md))_
3. Dans un fichier généré à chaque nouvelle session dans `res://log/`. Le nom du fichier de log est généré comme suit : `YYYY_MM_DD-hh_mm.log`, par exemple : `2024_10_15-13_19.log`

