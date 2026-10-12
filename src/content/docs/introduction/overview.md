---
title: Présentation du jeu
description: Ce qu'est Cat'aclysm et comment le jeu est organisé
sidebar:
  label: Présentation
  order: 1
---

**Cat'aclysm: Claw of the Dead** est un tower defense 2D développé avec Godot 4.4 (Forward Plus), qui cible Android. Le joueur défend une ville de chats contre des hordes de zombies.

- **Tours et pièges**: placés sur des tuiles valides, leurs statistiques viennent de `stats.json` (voir [Statistiques](/documentation/development/models/stats-model/)).
- **Niveaux et vagues**: définis en JSON (`resources/levels/lev.01.json` à `lev.08.json`), voir [Niveau et carte](/documentation/development/models/level-model/).
- **Arcs**: l'arc 1 (`arc.01`) couvre `lev.01` à `lev.05`, l'arc 2 (`arc.02`) `lev.06` à `lev.08`.
- **Défis**: objectifs optionnels par niveau qui rapportent des étoiles, voir [Défis](/documentation/development/models/challenge-model/).
- **Armurerie**: arbre de méta-progression débloqué avec les étoiles, voir [Armurerie](/documentation/development/models/armory-model/).
- **Langues**: français et anglais.

La scène principale est `res://scenes/main.tscn`.
Pour installer le projet, voir [Installation](/documentation/introduction/installation/).
