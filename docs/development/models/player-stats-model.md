---
title: Player stats Model
sidebar_position: 45
description: Modèle des stats joueur pendant une partie
---

# Player Stats

## Description

Les stats joueur runtime sont portées directement par `ILevel`.

Les deux stats critiques de partie sont :

- `health`: points de vie de la base
- `coins`: ressources de construction / upgrade

## Contrat public

### Propriétés clés

- `coins: int` avec setter `_set_coins`
- `health: int` avec setter `_set_health`

### Signal

- `stats_updated` (émis après changement de `coins` ou `health`)

## Règles métier

- Quand `health` diminue, le système notifie `ChallengeManager.notify_damage(...)`.
- Quand `health <= 0`, transition immédiate vers l'état `DEFEAT`.
- Toute mise à jour de `coins` ou de `health` déclenche le rafraîchissement UI via `stats_updated`.

## Source des valeurs

- Valeurs de départ codées dans `ILevel` (`coins = 50`, `health = 20`).
- Évolution en jeu selon constructions, kills, dommages reçus, etc.

## Attention

Ces stats sont des stats de session (niveau en cours), distinctes de la sauvegarde méta (`ProgressionData`).
