---
title: Projectile Model
sidebar_position: 35
description: Modèle projectile (impact, trajectoire, effets visuels)
---

# Projectile

## Description

`IBullet` est la classe de base des projectiles.

Le gameplay (dégâts, vitesse, effets) est appliqué à l'instanciation par la tour via `bullet_stats`.

## Contrat public

### Propriétés clés

- `damage: int`
- `speed: int`
- `direction: Vector2`
- `target: Vector2`
- `tower_owner: ITower`

### Cycle de vie

1. Spawn par une tour (`fire`).
2. Déplacement en `_physics_process`.
3. Détection de collision (`body_entered`).
4. Application des dégâts à `IEnemy`.
5. Nettoyage (désactivation, smoke, trail detach, free).

## Dépendances

- `ITower` (owner)
- `IEnemy` (cible touchée)
- `Global.paused`
- `SignalUtil`

## Bonnes pratiques

- Éviter les collisions multiples avec un flag d'impact (`_has_impacted`).
- Garder les scènes projectile très simples (VFX) et confier les chiffres à `StatsDB`.
- Ne pas oublier de désactiver le monitoring collision avant cleanup.
