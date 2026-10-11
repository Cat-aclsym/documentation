---
title: Comment lire / écrire un modèle Godot
description: Méthode et template pour lire ou écrire une page de modèle Godot
sidebar:
  label: Comment documenter un modèle
  order: 1
---

Cette page sert de référence pour créer des pages de modèles cohérentes (ennemi, tour, projectile, niveau, etc.).

## Pourquoi documenter les modèles?

Une page de modèle permet de répondre rapidement à:

- Quelle est la responsabilité de ce composant?
- Quelles entrées/sorties expose-t-il?
- Quelles dépendances et contraintes possède-t-il?
- Quels sont les points sensibles à ne pas casser?

## Structure recommandée d'une page modèle

1. Description du rôle du modèle
2. Contrat public (propriétés, méthodes, signaux)
3. Flux d'exécution principal
4. Dépendances (autoloads, ressources, scènes)
5. Cas d'usage et exemples
6. Pièges et bonnes pratiques
7. Diagramme (si utile)

## Template conseillé

```markdown
---
title: [name] Model
description: Description du modèle [name]
sidebar:
  order: 100
---

## Description

## Responsabilités

## Contrat public

### Propriétés clés

### Signaux

### Méthodes publiques

## Utilisation

## Flux d'exécution

## Dépendances

## Cas limites / erreurs

## Bonnes pratiques

## Structure

![Model diagram](/documentation/models/[name].svg)
```

Les diagrammes draw.io (`.svg`) se placent dans `public/models/` et se référencent avec le préfixe `/documentation`.

Le titre du front matter devient le titre (H1) de la page: ne pas le répéter dans le corps du fichier.

## Diagramme

Si nécessaire, ajouter un diagramme dans `## Structure`.
Le diagramme doit résumer l'essentiel: attributs publics, signaux, méthodes publiques, relations majeures.

Les diagrammes sont faits avec [Draw.io](https://app.diagrams.net/).

:::note
Le fichier contenant tous les diagrammes est stocké sur le cloud de l'équipe.

Demander l'accès à Pierre ou Benjamin en cas de besoin.

À terme, tous les fichiers seront centralisés dans le cloud Teams.
:::

## Convention UML (adaptée Godot)

- variable publique: `+ var_name: type`
- variable privée: `- var_name: type`
- variable exportée: `@ var_name: type`
- signal: `[signal] signal_name`
- signal typé: `[signal] signal_name(type)`
- fonction: `func_name()`
- fonction typée: `func_name(type): return_type`
- membre statique: `[static] variable|function`

:::caution
Sauf cas exceptionnel, documenter uniquement les attributs et méthodes publiques.
:::

## Exemple court (fictif)

```md
---
title: Enemy Model
---

## Description
Entité hostile qui suit un chemin, reçoit des dégâts et notifie sa mort.

## Contrat public

### Signaux
- `die`

### Méthodes publiques
- `take_damage(amount: int, damage_type: int) -> void`

## Dépendances
- `StatsDB` pour les stats de base
- `ChallengeManager` pour les notifications de kill
```
