---
title: Snippets
description: Snippets et templates IDE pour GDScript
sidebar:
  order: 10
---

## VSCode

**Pour créer un nouveau snippet :**

1. `Ctrl + Shift + P`
2. Snippets: Configure snippets
3. gdscript.json
4. Copier et coller votre snippet

### Exemple: Tracer les logs

```json
{
	"Trace Log": {
		"prefix": "trace",
		"body": [
			"Log.trace(Log.Level.${1|DEBUG,INFO,WARN,ERROR,FATAL|}, \"$2\")"
		],
		"description": "Insert a trace log with selectable log level"
	}
}
```

### Exemple: Fichier de base GDScript

```json
{
	"Base gdscript": {
		"prefix": "gdscript",
		"body": [
			"## © [2026] A7 Studio. All rights reserved. Trademark.",
			"",
			"extends ${1:Node}",
			"",
			"",
			"# Public functions",
			"$0",
			"",
			"",
			"# Private functions",
			""
		],
		"description": "Base structure for gdscript file"
	}
}
```

## Jetbrains IDE

**Pour créer un nouveau snippet :**

1. `Ctrl + Shift + A`
2. Live Templates
3. Créer ou sélectionner le groupe GDScript
4. Créer un Live Template

### Exemple: Trace les logs

Abréviation: `trace`
Description: `Log.trace(Log.Level.LEVEL, message)`
Code:
```gdscript
Log.trace(Log.Level.$LEVEL$, "$MESSAGE$")
```

Variables:

| Name    | Valeur de l'expression                          | Valeur par défaut |
|---------|-------------------------------------------------|-------------------|
| LEVEL   | enum("DEBUG", "INFO", "WARN", "ERROR", "FATAL") | DEBUG             |
| MESSAGE |                                                 |                   |

### Exemple: Fichier de base GDScript

Abbreviation: `gdscript`
Description: `Base structure for gdscript file`
Code:
```gdscript
## © [2026] A7 Studio. All rights reserved. Trademark.

extends Node


# Public functions


# Private functions
```

:::tip
Pour cet exemple, il serait préférable d'utiliser un File Template plutôt qu'un Live Template.
:::

## File Templates

Les File Templates sont des modèles de fichiers qui peuvent être utilisés pour créer des fichiers avec une structure prédéfinie.
Ils n'existent pas sur VSCode (à part avec une extension à rajouter).

**Pour créer un nouveau File Template :**

1. `Ctrl + Shift + A`
2. File and Code Templates
3. Créer un nouveau template

### Exemple: Fichier de base GDScript

Nom: `Base gdscript`
Extension: `gd`
Nom de fichier: (vide)
Code:
```gdscript
## © [2026] A7 Studio. All rights reserved. Trademark.

extends Node


# Public functions


# Private functions
```
