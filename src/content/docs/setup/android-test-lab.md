---
title: Tests automatisés Android (Firebase Test Lab)
description: Scénarios Game Loop joués par Firebase Test Lab sur l'APK, résultats écrits par le jeu et absence de tests unitaires
sidebar:
  label: Firebase Test Lab
  order: 6
---

Le jeu peut être lancé par [Firebase Test Lab](https://firebase.google.com/docs/test-lab/android/game-loop) en mode Game Loop. L'autoload `FirebaseTestLab` (`scripts/autoloads/firebase_test_lab.gd`) détecte ce lancement, joue un scénario, écrit un résultat et ferme le jeu. L'APK qui l'accepte est produit par la [CI](/documentation/setup/ci/).

## Détection

Au `_ready()`, l'autoload ne fait rien hors Android. Sur Android, il lit l'intent de l'activité (singleton `AndroidRuntime`): le lancement est un test si l'action est `com.google.intent.action.TEST_LOOP`. Le numéro de scénario est l'extra `scenario` de l'intent (1 par défaut).

L'export Godot ne déclare pas cet intent. La CI l'ajoute au manifeste de l'APK ([Intégration continue](/documentation/setup/ci/)).

## Scénarios

| Scénario | Action | Durée |
|---|---|---|
| 1 | Attend sur le menu d'accueil | 5 s |
| 2 | Charge la scène `lev.01.tscn` | 20 s |
| autre | Échec immédiat (`unknown scenario`) | - |

Un timeout global de 30 s (`SCENARIO_TIMEOUT`) termine le scénario avec le statut `success`. Le scénario 2 charge la scène du niveau avec `change_scene_to_file`, il ne joue pas de vague.

## Résultats

À la fin, le jeu écrit `results<scénario>.json` dans `/sdcard/Android/data/fr.a7studio.cataclysm/files/GameLoopsResults` puis quitte. Le fichier contient le numéro de scénario et un statut `success` ou `failure`:

```json
{"scenario": 1, "status": "success"}
```

`fr.a7studio.cataclysm` est le `package/unique_name` du preset Android. Les messages du scénario sont préfixés `FirebaseTestLab:` dans la sortie.

## Tests unitaires

Le dépôt n'a pas de framework de tests (ni GUT ni GdUnit, pas de dossier `tests/`). Le seul plugin sous `addons/` est Dialogic. Les scénarios ci-dessus sont les seuls tests automatisés, et ils vérifient que le jeu démarre sur un appareil sans planter.
