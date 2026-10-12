---
title: Interface et menus
description: Les scènes d'interface, le HUD, les menus, les popups, les effets d'écran et l'encyclopédie
sidebar:
  label: Interface
  order: 41
---

L'interface se compose du menu d'accueil, de ses sous-menus et, en niveau, du HUD et de menus superposés. Les textes passent par `tr()` ([Traductions](/documentation/development/guides/i18n/)).

## Racine: UI et HUD

- `UI` (`scenes/ui/ui.gd`, un `CanvasLayer`) s'enregistre dans `Global.ui`. Il contient le `HUD`, un rideau de fondu (`IngameFadeColorRect`) et le `TutorialManager` ([Tutoriel](/documentation/development/guides/tutorial/)).
- `UI.start_level()` charge le HUD (`hud.load_ui()`), prévient le tutoriel et joue le fondu d'entrée. `UI.end_level()` décharge le HUD et sauvegarde la progression.
- `UI.notify_new_enemy_reveal(enemy_id, texture, scale)` met en file l'animation de découverte d'un ennemi.
- Les menus ouverts en niveau sont ajoutés comme enfants de `Global.ui` (menu de construction, pause, défis, fin de partie).

`HUD` (`scenes/ui/menus/hud/hud.gd`) s'enregistre dans `Global.hud` et se met à jour à chaque `stats_updated` du niveau:

| Élément | Comportement |
|---|---|
| Pièces | Rebond du texte et pièces qui jaillissent quand le total augmente |
| Vie | Barre avec traînée (`ghost`), secousse de caméra et flash de shader quand la vie baisse |
| Vague | Numéro de la vague courante |
| Boutons | Défis, pause, construction ([Construction](/documentation/development/guides/building-placement/#menu-de-construction)), accélération x3 |

Signaux: `pause_requested`, `build_menu_opened`, `build_menu_closed`. La vie maximale du HUD est écrite en dur à 20, comme le `health` initial d'`ILevel`.

## Menus

| Menu | Scène | Rôle |
|---|---|---|
| Accueil | `menus/home/home.tscn` | Jouer, armurerie, encyclopédie, options |
| Sélection de niveau | `menus/level_selection/` | [Créer un niveau](/documentation/development/guides/levels-and-arcs/#menu-de-sélection) |
| Options | `menus/options/options.tscn` | Musique, sons, langue, liens (Instagram, X, Discord, contact) |
| Armurerie | `menus/armory/armory.tscn` | [Armurerie](/documentation/development/models/armory-model/) |
| Pause | `menus/pause/pause.tscn` | Reprendre, recommencer, retour à l'accueil, encyclopédie |
| Fin de partie | `menus/end_game/end_game.tscn` | Victoire ou défaite, défis, rejouer, niveau suivant |
| Défis | `menus/hud/challenges_menu.tscn` | Panneau latéral des défis du niveau |

Un sous-menu de l'accueil masque le conteneur principal, puis émet `menu_close` pour le restaurer. Tant que le tutoriel n'est pas terminé, le bouton jouer lance `lev.01` directement et les boutons armurerie et encyclopédie sont verrouillés (`?`).

## Widgets

- `ButtonEffects.apply(button)` (`scripts/ui/button_effects.gd`): réduit le bouton à 95 % pendant l'appui, avec un `process_mode` toujours actif pour fonctionner en pause. Chaque bouton l'appelle dans son `_ready()`.
- `StyledButton` (`scenes/ui/styled_button.tscn`): un `Button` qui applique `ButtonEffects` à lui-même.
- Thème global: `assets/resources/themes/generic.tres` (`gui/theme/custom` dans `project.godot`). Police: `DotGothic16-Regular.ttf` (`assets/ui/fonts/dotgothic/`).

## Popups

`PopupSpawner` (`scenes/ui/popup/popup_spawner.gd`, un `Marker2D` porté par `ILevel` et par les ennemis) crée les textes flottants:

- `display_damage(amount, color, is_critical)`: dégâts. Une tour avec `use_accumulative_popups` additionne les coups dans un seul `DamagePopup`. Les couleurs viennent de `TOWER_COLORS` (par `tower_id`).
- `score(text)`: texte qui monte de 16 px.
- `wave(text)`: bandeau de vague, ajouté à `Global.ui`.

## Effets d'écran

| Shader (`assets/resources/shaders/`) | Utilisation |
|---|---|
| `health_bar_scaling.gdshader` | Barre de vie du HUD |
| `low_health_vignette.gdshader` | `LowHealthIndicator`: vignette rouge pulsante quand la vie passe à 25 % ou moins |
| `radial_aura.gdshader` | Halo de l'écran de découverte d'un ennemi |
| `flat_alpha_tint.gdshader` | Silhouette noire de l'ennemi à découvrir |

`NewEnemyChallenger` joue l'écran de découverte quand un ennemi apparaît pour la première fois: `WaveStepSpawn` appelle `Global.ui.notify_new_enemy_reveal` puis `ProgressionManager.mark_enemy_seen`. Le jeu est en pause pendant l'animation et les révélations se jouent l'une après l'autre.

## Encyclopédie

`Encyclopedia` (`scenes/ui/menus/hud/encyclopedia.gd`) est ouverte depuis l'accueil et depuis le menu pause. Elle a deux catégories, `ENEMIES` et `TOWERS`, et tourne les pages avec précédent et suivant.

- Les entrées viennent de `StatsDB.get_tower_ids()` et `get_enemy_ids()`: nom, scène, stats ([Statistiques](/documentation/development/models/stats-model/)). Une entrée dont la scène n'existe pas est ignorée.
- Ennemis: vie, récompense, vitesse, plus les champs de `extra` (portée, cadence, durée d'étourdissement, délais d'attaque). Tours: coût, dégâts, cadence, portée.
- Un ennemi est découvert quand `ProgressionManager.is_enemy_seen(id)` est vrai, une tour quand elle est débloquée. Sinon la page affiche `?` et `ENCYCLOPEDIA.NOT_DISCOVERED`.
- Afficher une entrée découverte la marque comme lue (`encyclopedia_seen`). Un point d'exclamation signale les entrées non lues, sur l'accueil, la pause et les catégories.
- Les noms viennent d'une table de correspondance du script (`bat_01` vers `TOWER.BAT_01.NAME`, `rat` vers `ENEMY.RAT.NAME`). Seuls `bat_01`, `bat_02`, `big_daddy`, `damage_zombie`, `default_zombie` et `rat` y figurent, les autres identifiants utilisent `<ID>.NAME` (par exemple `BAT_03.NAME`), absent du CSV.

Les drapeaux sont dans [Progression et sauvegarde](/documentation/development/models/progression-model/).
