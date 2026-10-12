---
title: Interface et menus
description: Les scènes d'interface, le HUD, les menus, les widgets partagés, les popups, les effets d'écran et l'encyclopédie
sidebar:
  label: Interface
  order: 41
---

L'interface se compose du menu d'accueil, de ses sous-menus et, en niveau, du HUD et de menus superposés. Les textes passent par `tr()` ([Traductions](/documentation/development/guides/i18n/)). Les menus qui gèlent le jeu le font par une source de pause de `Global` (`Global.request_pause(&"source")`, `Global.release_pause(&"source")`).

## Racine: UI et HUD

- `UI` (`scenes/ui/ui.gd`, un `CanvasLayer`) s'enregistre dans `Global.ui`. Il contient le `HUD`, un rideau de fondu (`IngameFadeColorRect`) et le `TutorialManager` ([Tutoriel](/documentation/development/guides/tutorial/)).
- `UI.start_level()` charge le HUD (`hud.load_ui()`), prévient le tutoriel et joue le fondu d'entrée. `UI.end_level()` décharge le HUD, prévient le tutoriel et sauvegarde la progression.
- `UI.notify_new_enemy_reveal(enemy_id, texture, scale)` met en file l'animation de découverte d'un ennemi.
- Les menus ouverts en niveau sont ajoutés comme enfants de `Global.ui` (menu de construction, pause, défis, fin de partie).
- `ScenesLoader.go_home()` libère le niveau en cours, relâche toutes les pauses (`Global.clear_pauses()`) et recharge `scenes/main.tscn`. `ScenesLoader.start_level(level_id)` remplace le niveau en cours par une nouvelle instance de `lev.XX`, relâche les pauses, démarre le niveau et le HUD, et renvoie `null` quand la scène ne se charge pas. L'accueil, la sélection de niveau, la pause et l'écran de fin passent tous par ces deux fonctions.

`HUD` (`scenes/ui/menus/hud/hud.gd`) s'enregistre dans `Global.hud` et se met à jour à chaque `stats_updated` du niveau:

| Élément | Comportement |
|---|---|
| Pièces | Rebond du texte et pièces qui jaillissent quand le total augmente |
| Vie | Barre avec traînée (`ghost`) dont le maximum est `ILevel.max_health`, secousse de caméra et flash de shader quand la vie baisse |
| Vague | Numéro de la vague courante |
| Boutons | Défis, pause, construction ([Construction](/documentation/development/guides/building-placement/#menu-de-construction)), accélération x3 |

Signaux: `pause_requested`, `build_menu_opened`, `build_menu_closed`.

Le bouton d'accélération passe `Engine.time_scale` de `DEFAULT_TIME_SCALE` (1) à `SKIP_TIME_SCALE` (3). Il est ignoré tant que le temps est gelé (`Global.is_time_frozen()`): `ILevel` restaure l'échelle de temps qu'il a gelée à la reprise, un changement fait pendant le gel serait perdu.

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
| Info d'une tour | `menus/tower_upgrade/tower_info.tscn` | Statistiques courantes de la tour |
| Amélioration | `menus/tower_upgrade/tower_upgrade_menu.tscn` | Choix et confirmation d'une amélioration |

Un sous-menu de l'accueil masque le conteneur principal, puis émet `menu_close` pour le restaurer. Tant que le tutoriel n'est pas terminé, le bouton jouer lance `lev.01` directement et les boutons armurerie et encyclopédie sont verrouillés (`?`). Un bouton de debug des icônes de statistiques s'ajoute quand `Global.debug` est vrai.

### Pause

Le bouton pause du HUD (ignoré si le jeu est déjà en pause) ferme le menu de construction, demande la source `&"pause_menu"` puis ajoute `Pause` (`pause.gd`) à `Global.ui`. `Pause` émet `resumed` quand le joueur reprend: `Global.release_pause(&"pause_menu")` puis `queue_free()`. Le bouton recommencer appelle `ScenesLoader.start_level()`, le bouton accueil `ScenesLoader.go_home()`. L'encyclopédie s'ouvre dans le menu pause, avec un point d'exclamation quand des entrées sont non lues. Les boutons musique et son du menu pause reçoivent `ButtonEffects` et changent les mêmes réglages que le menu options: à l'ouverture, leur état (`button_pressed` vaut « coupé ») reflète `music_enabled` et `sound_enabled` de la progression, et chaque bascule (`toggled`) écrit le réglage, appelle `ProgressionManager.save_game()` puis `ProgressionManager.apply_settings()` ([Audio](/documentation/development/guides/audio/#réglages-du-joueur)).

### Écran de fin

`ILevel._on_level_end()` demande la source `&"level_end"` (le temps continue de tourner), arrête le tutoriel s'il tourne, ajoute `EndGame` à `Global.ui` et appelle `EndGame.init(victory)`:

- **Victoire**: titre `ENDGAMEMENU.LEVEL.TITLE.WIN`, `ProgressionManager.complete_level(level_id)`, dialogue unique `first_victory`.
- **Défaite**: titre `ENDGAMEMENU.LEVEL.TITLE.LOSE`, bouton « suivant » masqué, dialogue unique `first_defeat`.

L'écran affiche le temps, la vie sur `max_health` et les défis du niveau (`ChallengeManager.get_active_challenges()`) avec une étoile pleine, vide ou rouge. Les boutons appellent `ScenesLoader.go_home()` et `ScenesLoader.start_level()` (même niveau ou `ProgressionManager.get_next_level_id`). Les dialogues uniques sont décrits dans [Dialogic](/documentation/development/guides/dialogic-guide/#dialogues-du-jeu).

### Menus d'une tour

Cliquer sur une tour ajoute un `RadialTowerUpgradeMenu` (enfant de la tour) avec les boutons vendre, améliorer, informations et fermer. Le prix de vente est `tower.sell_price`, le prix d'amélioration `StatsDB.get_upgrade_price(tower.available_upgrade_ids[0])`; sans amélioration disponible, le bouton est grisé et affiche `TOWER.UPGRADE.MAX`.

| Menu | Source de pause | Détails |
|---|---|---|
| `TowerInfo` | `&"tower_info"` | Barres de statistiques courantes, fermé par un clic hors du panneau |
| `TowerUpgradeMenu` | `&"upgrade_menu"` | Un onglet par amélioration disponible. Le bouton de confirmation affiche `StatsDB.get_upgrade_price(id)` (`TOWER.UPGRADE.PRICE`) et est grisé quand `ILevel.coins` ne suffit pas. Confirmer émet `upgrade_confirmed` puis appelle `tower.start_upgrade(id)` |

Ces deux sources ne sont ni dans `Global.TREE_PAUSING_SOURCES` ni dans `Global.TIME_RUNNING_SOURCES`: elles gèlent le gameplay et le temps sans mettre l'arbre en pause. `StatBar` (`stat_bar.gd`) dessine une statistique: icône, nom et jauge de `TICK_COUNT` (15) graduations, la valeur maximale de référence étant `MAX_STAT_VALUE` (200). Le nom vient de la clé `STAT.<NOM EN MAJUSCULES>` (`tr("STAT.%s" % stat_name.to_upper())`), l'icône d'une table de `assets/ui/stats/`. Les statistiques purement visuelles (`SKIP_BULLET_STATS`) ne s'affichent pas.

## Widgets

- `ButtonEffects.apply(button)` (`scripts/ui/button_effects.gd`, un `RefCounted` statique): réduit le bouton à 95 % (`CLICK_SCALE`) pendant l'appui, avec un `process_mode` toujours actif pour fonctionner en pause, et centre le pivot avec `pivot_offset_ratio = Vector2(0.5, 0.5)` (`PIVOT_RATIO`), qui suit la taille du bouton sans code de recentrage. Les scènes qui animent l'échelle d'un contrôle (libellé de pièces du HUD, bandeau de vague) posent aussi `pivot_offset_ratio` dans le `.tscn` au lieu de calculer `pivot_offset` en code. L'appel est idempotent: la méta `APPLIED_META_KEY` (`&"button_effects"`) marque le bouton, une seconde application ne fait rien. Chaque bouton peut donc l'appeler dans son `_ready()` sans risque de double connexion.
- `StyledButton` (`scenes/ui/styled_button.tscn`): un `Button` qui applique `ButtonEffects` à lui-même dans `_ready()`. Les boutons de l'accueil, de l'armurerie et du menu d'amélioration en sont des instances.
- Thème global: `assets/resources/themes/generic.tres` (`gui/theme/custom` dans `project.godot`). Police: `dotgothic16_regular.ttf` (`assets/ui/fonts/dotgothic/`).
- `SpritePreview` (`scripts/ui/sprite_preview.gd`, un `RefCounted`): `SpritePreview.from_scene(scene)` instancie la scène d'une tour, d'un piège ou d'un ennemi et lit son sprite (`texture`, `frames`, `animation`, `fps`, `scale`, `modulate`). La recherche essaie les nœuds `Sprite`, `AnimatedSprite2D` et `Sprite2D`, puis le premier `AnimatedSprite2D` ou `Sprite2D` de la scène. Elle renvoie un aperçu vide quand la scène est nulle ou sans sprite. L'armurerie et l'encyclopédie l'utilisent toutes les deux.

### Variations de thème

`generic.tres` déclare des variations de type, choisies par `theme_type_variation` sur le nœud:

| Variation | Base | Utilisation |
|---|---|---|
| `StyledButton` | `Button` | Bouton bleu (normal, survol, appui, désactivé) |
| `StyledButtonGreen` | `Button` | Bouton vert |
| `StyledButtonOrange` | `Button` | Bouton orange |
| `HomeButton` | `StyledButton` | Boutons de l'accueil (jouer, armurerie): police 35 avec contour |
| `HomeButtonOrange` | `StyledButtonOrange` | Bouton encyclopédie de l'accueil |
| `HomeButtonGreen` | `StyledButtonGreen` | Bouton paramètres de l'accueil |
| `HeaderLarge`, `HeaderMedium`, `HeaderSmall` | `Label` | Titres |
| `UILabel` | `Label` | Textes du HUD et des cartes de défi |

Le style d'un bouton se règle par ces variations, pas par des `theme_override_*` dans les scènes.

## Popups

`PopupSpawner` (`scenes/ui/popup/popup_spawner.gd`, un `Marker2D` porté par `ILevel` et par les ennemis) crée les textes flottants:

- `display_damage(amount: float, color: Color = Color.WHITE, tower: ITower = null, is_critical: bool = false)`: dégâts. Quand `tower` est valide, sa couleur de `TOWER_COLORS` (par `tower_id`) remplace `color`, et une tour avec `use_accumulative_popups` additionne les coups dans un seul `DamagePopup`. `IEnemy.take_damage()` passe la tour qui a porté le coup.
- `score(text)`: texte qui monte de 16 px.
- `wave(text)`: bandeau de vague, ajouté à `Global.ui`.

## Effets d'écran

| Shader (`assets/resources/shaders/`) | Utilisation |
|---|---|
| `health_bar_scaling.gdshader` | Barre de vie du HUD |
| `low_health_vignette.gdshader` | `LowHealthIndicator`: vignette rouge pulsante quand la vie passe à 25 % ou moins |
| `radial_aura.gdshader` | Halo de l'écran de découverte d'un ennemi |
| `flat_alpha_tint.gdshader` | Silhouette noire de l'ennemi à découvrir |

`NewEnemyChallenger` joue l'écran de découverte quand un ennemi apparaît pour la première fois: `WaveStepSpawn` appelle `Global.ui.notify_new_enemy_reveal` puis `ProgressionManager.mark_enemy_seen`. Le HUD demande la source `&"new_enemy"` pendant l'animation et les révélations se jouent l'une après l'autre. Quand la file est vide, le HUD lance le dialogue unique `first_boss` (pour `big_daddy`) ou `first_new_enemy` (autre ennemi que `default_zombie`).

## Encyclopédie

`Encyclopedia` (`scenes/ui/menus/hud/encyclopedia.gd`) est ouverte depuis l'accueil et depuis le menu pause. Elle a deux catégories, `ENEMIES` et `TOWERS`, et tourne les pages avec précédent et suivant.

- Les entrées viennent de `StatsDB.get_tower_ids()` et `get_enemy_ids()`: scène, stats ([Statistiques](/documentation/development/models/stats-model/)). Le nom est la clé `StatsDB.name_key("TOWER", id)` ou `name_key("ENEMY", id)`. Une entrée dont la scène n'existe pas est ignorée avec un avertissement.
- Ennemis: vie, récompense, vitesse, plus les champs de `extra` (portée, cadence, durée d'étourdissement, délais d'attaque). Tours: coût, dégâts, cadence, portée. Les libellés sont les clés `ENCYCLOPEDIA.STATS.*`.
- La grille de stats (`stats_grid`) est déclarée avec `mouse_behavior_recursive` désactivé dans `encyclopedia.tscn`: les libellés et conteneurs que le script y ajoute n'ont pas besoin de régler leur `mouse_filter`.
- L'aperçu de chaque entrée vient de `SpritePreview.from_scene()`, mis en cache dans l'entrée.
- Un ennemi est découvert quand `ProgressionManager.is_enemy_seen(id)` est vrai, une tour quand `ProgressionManager.is_tower_unlocked(id)` l'est. Sinon la page affiche `?`, la silhouette noire de l'aperçu et `ENCYCLOPEDIA.NOT_DISCOVERED`.
- Afficher une entrée découverte la marque comme lue (`mark_enemy_encyclopedia_seen`, `mark_tower_encyclopedia_seen`, drapeau `encyclopedia_seen`). Un point d'exclamation signale les entrées non lues, sur l'accueil, la pause et les catégories.

Les drapeaux sont dans [Progression et sauvegarde](/documentation/development/models/progression-model/).
