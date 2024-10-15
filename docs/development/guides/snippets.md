---
title: Snippets
sidebar_position: 10
description: Documentation dashboard
---

# Snippets

<Tabs>
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
			"Log.trace(Log.Level.${1|DEBUG,INFO,WARN,ERROR,FATAL|}, \"$2\");"
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
			"# core\n\n",
			"# public\n\n",
			"# private\n\n",
			"# signal\n\n",
			"# event\n\n",
			"# setget\n\n"
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
Description: `Log.trace(Log.Level.TRACE, thing)`
Code:
```gdscript
Log.trace(Log.Level.$LEVEL$, "$MESSAGE$");
```

Variables: 

| Name  | Valeur de l'expression                          | Valeur par défaut |
|-------|-------------------------------------------------|-------------------|
| level | enum("DEBUG", "INFO", "WARN", "ERROR", "FATAL") | DEBUG             |
| value |                                                 |                   |


### Exemple: Fichier de base GDScript

Abbreviation: `gdscript`
Description: `Base structure for gdscript file`
Code:
```gdscript
# core

# public

# private

# signal

# event

# setget
```

:::tip
Pour cet exemple, il serait préférable d'utiliser un File Template plutôt qu'un Live Template.
::::

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
# core

# public

# private

# signal

# event

# setget
```
</Tabs>
