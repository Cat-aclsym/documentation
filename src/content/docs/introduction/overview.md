---
title: Overview
description: Présentation du jeu Cat'aclysm
sidebar:
  order: 1
---

**Cat'aclsym: Claw of the Dead** est un tower defense 2D développé avec Godot 4.4 (Forward Plus), cible Android. Le joueur défend une ville de chats contre des hordes de zombies.

- **Tours et pièges**: placés sur des tuiles valides, leurs statistiques viennent de `stats.json` (voir [Stats](/documentation/development/models/stats-model/)).
- **Niveaux et vagues**: définis en JSON (`resources/levels/lev.01.json` à `lev.08.json`), voir [ILevel et IMap](/documentation/development/models/level-model/).
- **Arcs**: l'arc 1 (`arc.01`) couvre `lev.01` à `lev.05`, l'arc 2 (`arc.02`) `lev.06` à `lev.08`.
- **Challenges**: objectifs optionnels par niveau qui rapportent des étoiles, voir [Challenge](/documentation/development/models/challenge-model/).
- **Armurerie**: arbre de méta-progression débloqué avec les étoiles, voir [Armory](/documentation/development/models/armory-model/).
- **Langues**: français et anglais.

La scène principale est `res://scenes/main.tscn`.
Pour installer le projet, voir [Installation](/documentation/introduction/installation/).
