---
title: README
sidebar_position: 1
description: Comment lire un model godot
---

# Comment lire / écrire un model Godot ?


## Template [WIP]

```markdown
---
title: [name] Model
description: Description of [name] model
---

# [name]

## Description

## Utilisation

---

## Structure

![Model diagram](/assets/[name].drawio.svg)
```

## Diagramme

Si nécessaire, un diagramme décrivant le model devra eêre integré dans la partie `## Structure`.

Les diagrammes sont fait avec [Draw.io](https://app.diagrams.net/).

:::info
Le fichier contenants tous les diagrammes est stocké sur le gcloud de la startup, tout nouveau diagramme doit y être integré.

Demander l'accés à @Pierre ou @Benjamin en cas de besoin.

A terme tout les fichiers seront deplacé dans le cloud de teams.
:::


### Spécifications UML for Godot

- **variable public** : `+ var_name: type`
- **variable privé** : `- var_name: type`
- **variable export** : `@ var_name: type`
- **signal** : `[signal] signal_name`
- **signal** : `[signal] signal_name(type)`
- **function** : `func_name()`
- **function** : `func_name(type): return_type`
- **static** : `[static] variable|function`

:::warning
Sauf cas exceptionnel, il est préférable de déclarer uniquement les attributs et méthodes `publique`.
:::