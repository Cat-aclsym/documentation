---
title: Interface et menus
description: Les scènes d'interface, le HUD, les menus, les widgets partagés, les popups, les effets d'écran et l'encyclopédie
sidebar:
  label: Interface
  order: 41
---

L'interface se compose du menu d'accueil, de ses sous-menus et, en niveau, du HUD et de menus superposés. Les textes passent par `tr()` ([Traductions](/documentation/development/guides/i18n/)). Les menus qui gèlent le jeu le font par une source de pause de `Global` (`Global.request_pause(&"source")`, `Global.release_pause(&"source")`).

## Racine: UI et HUD

- `UI` (`ui/ui.gd`, un `CanvasLayer`) s'enregistre dans `Global.ui`. Il contient le `HUD`, un rideau de fondu (`IngameFadeColorRect`) et le `TutorialManager` ([Tutoriel](/documentation/development/guides/tutorial/)).
- `UI.start_level()` charge le HUD (`hud.load_ui()`), prévient le tutoriel et joue le fondu d'entrée. `UI.end_level()` décharge le HUD, prévient le tutoriel et sauvegarde la progression.
- `UI.notify_new_enemy_reveal(enemy_id, texture, scale)` met en file l'animation de découverte d'un ennemi.
- Les menus ouverts en niveau sont ajoutés comme enfants de `Global.ui` (menu de construction, pause, défis, fin de partie).
- `ScenesLoader.go_home()` libère le niveau en cours, relâche toutes les pauses (`Global.clear_pauses()`) et recharge `main.tscn`. `ScenesLoader.start_level(level_id)` remplace le niveau en cours par une nouvelle instance de `lev.XX`, relâche les pauses, démarre le niveau et le HUD, et renvoie `null` quand la scène ne se charge pas. L'accueil, la sélection de niveau, la pause et l'écran de fin passent tous par ces deux fonctions.

`HUD` (`ui/hud/hud.gd`) s'enregistre dans `Global.hud` et se met à jour à chaque `stats_updated` du niveau:

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
| Accueil | `ui/menus/home/home.tscn` | Jouer, armurerie, encyclopédie, options |
| Sélection de niveau | `ui/menus/level_selection/` | [Créer un niveau](/documentation/development/guides/levels-and-arcs/#menu-de-sélection) |
| Options | `ui/menus/options/options.tscn` | Musique, sons, langue, liens (Instagram, X, Discord, contact) |
| Armurerie | `ui/menus/armory/armory.tscn` | [Armurerie](/documentation/development/models/armory-model/) |
| Pause | `ui/menus/pause/pause.tscn` | Reprendre, recommencer, retour à l'accueil, encyclopédie |
| Fin de partie | `ui/menus/end_game/end_game.tscn` | Victoire ou défaite, défis, rejouer, niveau suivant |
| Défis | `ui/menus/challenges/challenges_menu.tscn` | Panneau latéral des défis du niveau |
| Info d'une tour | `ui/menus/tower_upgrade/tower_info.tscn` | Statistiques courantes de la tour |
| Amélioration | `ui/menus/tower_upgrade/tower_upgrade_menu.tscn` | Choix et confirmation d'une amélioration |

Un sous-menu de l'accueil masque le conteneur principal, puis émet `menu_close` pour le restaurer. Tant que le tutoriel n'est pas terminé, le bouton jouer lance `lev.01` directement et les boutons armurerie et encyclopédie sont verrouillés (`?`). Les boutons jouer, armurerie, encyclopédie et paramètres sont des `GameButton` de forme `PANEL`. Un bouton de debug des icônes de statistiques s'ajoute quand `Global.debug` est vrai.

### Pause

Le bouton pause du HUD (ignoré si le jeu est déjà en pause) ferme le menu de construction, demande la source `&"pause_menu"` puis ajoute `Pause` (`pause.gd`) à `Global.ui`. `Pause` émet `resumed` quand le joueur reprend: `Global.release_pause(&"pause_menu")` puis `queue_free()`. Le bouton recommencer appelle `ScenesLoader.start_level()`, le bouton accueil `ScenesLoader.go_home()`. L'encyclopédie s'ouvre dans le menu pause, avec un point d'exclamation quand des entrées sont non lues. Les boutons musique et son du menu pause sont des `GameButton` à bascule (`MUSIC` / `MUSIC_OFF` et `SOUND` / `SOUND_OFF`, [Boutons](#boutons-gamebutton)). Ils changent les mêmes réglages que le menu options: à l'ouverture, leur état (`button_pressed` vaut « coupé », posé avec `set_pressed_no_signal`) reflète `music_enabled` et `sound_enabled` de la progression, et chaque bascule (`toggled`) écrit le réglage, appelle `ProgressionManager.save_game()` puis `ProgressionManager.apply_settings()` ([Audio](/documentation/development/guides/audio/#réglages-du-joueur)).

### Écran de fin

`ILevel._on_level_end()` demande la source `&"level_end"` (le temps continue de tourner), arrête le tutoriel s'il tourne, ajoute `EndGame` à `Global.ui` et appelle `EndGame.init(victory)`:

- **Victoire**: titre `ENDGAMEMENU.LEVEL.TITLE.WIN`, `ProgressionManager.complete_level(level_id)`, dialogue unique `first_victory`.
- **Défaite**: titre `ENDGAMEMENU.LEVEL.TITLE.LOSE`, bouton « suivant » masqué, dialogue unique `first_defeat`.

L'écran affiche le temps, la vie sur `max_health` et les défis du niveau (`ChallengeManager.get_active_challenges()`) avec une étoile pleine, vide ou rouge. Les boutons appellent `ScenesLoader.go_home()` et `ScenesLoader.start_level()` (même niveau ou `ProgressionManager.get_next_level_id`). Les dialogues uniques sont décrits dans [Dialogic](/documentation/development/guides/dialogic-guide/#dialogues-du-jeu).

### Menus d'une tour

Cliquer sur une tour ajoute un `RadialTowerUpgradeMenu` (enfant de la tour) avec les boutons vendre, améliorer, informations et fermer: quatre `GameButton` de forme `HEXA` dont `process_when_paused` est désactivé, ils s'arrêtent avec l'arbre en pause. Le prix de vente est `tower.sell_price`, le prix d'amélioration `StatsDB.get_upgrade_price(tower.available_upgrade_ids[0])`; sans amélioration disponible, le bouton est grisé et affiche `TOWER.UPGRADE.MAX`.

| Menu | Source de pause | Détails |
|---|---|---|
| `TowerInfo` | `&"tower_info"` | Barres de statistiques courantes, fermé par un clic hors du panneau |
| `TowerUpgradeMenu` | `&"upgrade_menu"` | Un onglet par amélioration disponible. Le bouton de confirmation affiche `StatsDB.get_upgrade_price(id)` (`TOWER.UPGRADE.PRICE`) et est grisé quand `ILevel.coins` ne suffit pas. Confirmer émet `upgrade_confirmed` puis appelle `tower.start_upgrade(id)` |

Ces deux sources ne sont ni dans `Global.TREE_PAUSING_SOURCES` ni dans `Global.TIME_RUNNING_SOURCES`: elles gèlent le gameplay et le temps sans mettre l'arbre en pause. `StatBar` (`stat_bar.gd`) dessine une statistique: icône, nom et jauge de `TICK_COUNT` (15) graduations, la valeur maximale de référence étant `MAX_STAT_VALUE` (200). Le nom vient de la clé `STAT.<NOM EN MAJUSCULES>` (`tr("STAT.%s" % stat_name.to_upper())`), l'icône d'une table de `assets/ui/stats/`. Les statistiques purement visuelles (`SKIP_BULLET_STATS`) ne s'affichent pas.

## Widgets

- `ButtonEffects.apply(button: Control, process_when_paused: bool = true)` (`ui/components/button_effects.gd`, un `RefCounted` statique): réduit le bouton à 95 % (`CLICK_SCALE`) pendant l'appui (tween de `TWEEN_DURATION`, 0,1 s, qui tourne aussi sous une pause de l'arbre), et centre le pivot avec `pivot_offset_ratio = Vector2(0.5, 0.5)` (`PIVOT_RATIO`), qui suit la taille du bouton sans code de recentrage. Avec `process_when_paused` à `true`, le `process_mode` du bouton passe à `PROCESS_MODE_ALWAYS` pour qu'il fonctionne en pause, sinon il reste tel quel. Les scènes qui animent l'échelle d'un contrôle (libellé de pièces du HUD, bandeau de vague) posent aussi `pivot_offset_ratio` dans le `.tscn` au lieu de calculer `pivot_offset` en code. L'appel est idempotent: la méta `APPLIED_META_KEY` (`&"button_effects"`) marque le bouton, une seconde application ne fait rien.
- `GameButton` appelle `ButtonEffects.apply` lui-même dans `_ready()` (hors éditeur). Les contrôles qui ne sont pas des `GameButton` l'appellent explicitement: les cartes de construction (`BuildCard`), les zones d'onglets de l'encyclopédie et les indicateurs de niveau (`LevelIndicator`).
- Thème global: `ui/theme/generic.tres` (`gui/theme/custom` dans `project.godot`). Police: `dotgothic16_regular.ttf` (`assets/fonts/dotgothic/`).
- `SpritePreview` (`ui/components/sprite_preview.gd`, un `RefCounted`): `SpritePreview.from_scene(scene)` instancie la scène d'une tour, d'un piège ou d'un ennemi et lit son sprite (`texture`, `frames`, `animation`, `fps`, `scale`, `modulate`). La recherche essaie les nœuds `Sprite`, `AnimatedSprite2D` et `Sprite2D`, puis le premier `AnimatedSprite2D` ou `Sprite2D` de la scène. Elle renvoie un aperçu vide quand la scène est nulle ou sans sprite. L'armurerie et l'encyclopédie l'utilisent toutes les deux.

### Variations de thème

`generic.tres` déclare des variations de type, choisies par `theme_type_variation` sur le nœud:

| Variation | Base | Utilisation |
|---|---|---|
| `GameButtonRect`, `GameButtonRectShort`, `GameButtonHexa`, `GameButtonPanel`, `GameButtonBanner`, `GameButtonNone` | `Button` | Une par `GameButton.Shape`: couleur du texte (encre) et marges de contenu. `PANEL` ajoute la police `dotgothic_variation.tres` (espacement des glyphes de 3) et un contour de 6 px. `GameButton.shape` les pose lui-même |
| `HeaderLarge`, `HeaderMedium`, `HeaderSmall` | `Label` | Titres |
| `UILabel` | `Label` | Textes du HUD et des cartes de défi |

## Boutons (GameButton)

`GameButton` (`ui/components/game_button/game_button.gd`, un `Button` marqué `@tool`) est le bouton pixel art du jeu. Son corps est une base grise découpée en 9 zones (`NinePatchRect` `%Background`), recolorée par un shader avec une ligne de `palette.png`, avec en option un glyphe (`GameIcon`) centré dessus. Un bouton se crée en instanciant la scène `ui/components/game_button/game_button.tscn` (minimum `46 x 39`, forme `RECT`), jamais avec un bouton qui embarque son propre dessin. La scène a besoin de son nœud `%Background` et de son `ShaderMaterial` (des `assert` dans `_ready()`), et le matériau est local à chaque instance (`resource_local_to_scene`), donc chaque bouton a sa propre ligne de palette.

```gdscript
var button: GameButton = preload("res://ui/components/game_button/game_button.tscn").instantiate()
button.shape = GameButton.Shape.RECT
button.palette = GameButton.Palette.GREEN
button.game_icon = GameIcon.Id.BUILD
button.palette_pressed = GameButton.Palette.RED
button.game_icon_pressed = GameIcon.Id.CLOSE
button.toggle_mode = true
```

Dans une scène, les mêmes propriétés sont des exports (`shape`, `palette`, `game_icon`, `game_icon_pressed`, `palette_pressed`, `process_when_paused`).

### Formes (`shape`)

`GameButton.Shape` choisit la base (`GameButton.BASES`, art dans `assets/ui/buttons/bases/`), ses marges de découpe (`GameButton.MARGINS`, en pixels: gauche, haut, droite, bas) et la variation de thème (`GameButton.VARIATIONS`):

| Forme | Base | Taille | Marges | Usage typique |
|---|---|---|---|---|
| `RECT` | `rect.png` | 46 x 39 | 8, 8, 9, 9 | Boutons d'icône (menu pause, options, fin de partie, bascules) |
| `RECT_SHORT` | `rect_short.png` | 46 x 31 | 8, 8, 9, 9 | Boutons d'icône plus bas: pause et accélération du HUD, fermeture des menus, annulation du placement |
| `HEXA` | `hexa.png` | 34 x 39 | 2, 10, 30, 13 | Menu radial de tour (vendre, améliorer, informations, fermer) |
| `PANEL` | `panel.png` | 44 x 44 | 11, 11, 13, 13 | Boutons textuels du menu d'accueil |
| `BANNER` | `banner.png` | 187 x 44 | 11, 11, 13, 13 | Bouton d'achat de l'armurerie et bandeau de vague |
| `NONE` | aucune | | | Glyphe seul, sans fond, comme les flèches de l'encyclopédie et de la sélection de niveau |

Changer `shape` après `_ready()` reconstruit le fond (`_apply_shape()`). Avec `NONE`, `%Background` est masqué.

### Palettes et échange de palette (`palette`)

`GameButton.Palette` compte six valeurs, dans l'ordre des lignes de `assets/ui/buttons/palette.png`: `BLUE` (le bleu sarcelle, valeur par défaut), `GREEN`, `ORANGE`, `RED`, `SAND` et `GREY` (neutre ou désactivé). `palette.png` fait 7 colonnes sur 6 lignes (une ligne par `Palette`, un test le vérifie).

Les bases sont en niveaux de gris: le canal rouge de chaque pixel est un numéro de colonne de la palette (0 contour, 1 ombre, 2 corps, 3 reflet, etc.). Le shader `palette_swap.gdshader` lit ce niveau, va chercher la couleur à la colonne `niveau` et à la ligne `palette_row` de `palette.png` (`texelFetch`), garde l'alpha de la base et la couleur de sommet (`modulate`). Les uniforms `brightness` et `saturation` portent les états du bouton. Changer une couleur ou le dessin d'une base revient donc à éditer un seul PNG, sans toucher aux scènes.

### Glyphes (`game_icon`)

`GameIcon` (`ui/components/game_button/game_icon.gd`, un `RefCounted`) découpe `assets/ui/buttons/icons.png` en cellules de `CELL_SIZE` (64 px), sur `COLUMNS` (8) colonnes. L'ordre de l'enum `GameIcon.Id` est l'ordre des cellules: la cellule de `id` est `id - 1`, ligne par ligne (`NONE` n'a pas de cellule). `GameIcon.texture(id)` renvoie un `AtlasTexture` partagé (`null` pour `NONE`), `GameIcon.region(id)` la zone en pixels et `GameIcon.key(id)` le nom de l'id.

```gdscript
var home: AtlasTexture = GameIcon.texture(GameIcon.Id.HOME)
```

Les glyphes à une couleur sont dessinés en blanc (ceux avec ombrage ajoutent un gris clair) et teintés par le bouton: encre sombre (`GameButton.INK`) sur toutes les palettes, blanc sur `RED`. Les glyphes de `GameIcon.MULTICOLOR` (`FLAG_EN`, `FLAG_FR`, `ARROW_LEFT`, `ARROW_RIGHT`) gardent leurs couleurs.

### Bascules

Un bouton en `toggle_mode` peut changer de glyphe et de palette tant que `button_pressed` est vrai: `game_icon_pressed` (`NONE` garde `game_icon`) et `palette_pressed` (`GameButton.NO_PALETTE`, la valeur par défaut, garde `palette`). L'échange suit aussi `set_pressed_no_signal()`. `get_effective_icon()` et `get_effective_palette()` renvoient ce qui est dessiné à l'instant. Exemples du jeu: le bouton de construction du HUD (`BUILD` vert, `CLOSE` rouge une fois pressé), les boutons musique et son (`MUSIC` vers `MUSIC_OFF`, `SOUND` vers `SOUND_OFF`).

### États

| État | Rendu |
|---|---|
| Survol | Luminosité x 1,15 (`BRIGHTNESS_HOVER`) |
| Appui | Luminosité x 0,8 (`BRIGHTNESS_PRESSED`) |
| Désactivé | Saturation à 0, glyphe à 0,6 de luminosité (`GLYPH_BRIGHTNESS_DISABLED`) |

Une bascule verrouillée qui a un échange (`game_icon_pressed` ou `palette_pressed` renseigné) n'est pas assombrie: l'échange est son apparence appuyée, seul le survol l'éclaircit. Les états passent par `disabled` et `palette`, jamais par `modulate`.

### Boutons textuels

Avec un `text`, la base est étirée par sa découpe en 9 zones à la taille du bouton. Le texte (une clé de traduction, par exemple `HOME.PLAY.BUTTON`) est de la couleur d'encre du thème, blanc sur la palette `RED` (le bouton pose les six surcharges `font_*_color` en jeu, jamais dans l'éditeur, et les retire en quittant `RED`, ce qui efface aussi celles posées sur l'instance). `PANEL` utilise la variation avec la police `dotgothic_variation.tres` et son contour.

### Mise à l'échelle (`art_scale`)

Un bouton sans texte, de forme `RECT`, `RECT_SHORT` ou `HEXA` (`GameButton.SCALED_SHAPES`), plus grand que sa base, dessine la base et le glyphe agrandis, centrés et avec les proportions de la base, au lieu d'étirer la découpe. `art_scale` (lecture seule) vaut le plus grand facteur qui tient dans le bouton, au moins 1 et pas forcément entier: les pixels de l'art n'ont donc pas tous la même taille à l'écran. Les autres cas (texte, `PANEL`, `BANNER`, taille native) étirent la base et laissent `art_scale` à 1.

### Pause

`process_when_paused` (vrai par défaut) passe le `process_mode` du bouton à `PROCESS_MODE_ALWAYS` (via `ButtonEffects.apply`): il reste cliquable quand l'arbre est en pause, comme dans le menu pause ou pendant le tutoriel. Il se désactive pour les boutons qui doivent s'arrêter avec le jeu: menu radial de tour, bouton d'achat de l'armurerie, bandeau de vague.

### Infobulles et accessibilité

L'infobulle est `tooltip_text` traduit quand il est renseigné, sinon la traduction de `BUTTON.<ID>` du glyphe affiché (`BUTTON.HOME`, `BUTTON.FAST_FORWARD`...). En jeu, un bouton sans texte reçoit cette même chaîne dans `accessibility_name` (jamais dans l'éditeur, qui l'écrirait dans chaque instance à la sauvegarde de la scène). Les clés sont dans `assets/translations/translations.csv`.

### Galerie de debug

`debug/game_button_gallery.tscn` affiche chaque forme avec chaque palette, des boutons textuels, des bascules, les drapeaux, les flèches, les états désactivés et tous les glyphes, à l'échelle du pixel:

```bash
godot --path . res://debug/game_button_gallery.tscn
```

À ouvrir après tout changement de `palette.png`, d'une base ou de `icons.png`. Les tests de `tests/ui/components/` (`test_game_button.gd`, `test_game_icon.gd`) couvrent les formes, les palettes, les bascules, les états, l'échelle, l'infobulle, l'atlas et le mode multicolore ([Tests](/documentation/development/guides/testing/)).

### Ajouter une icône

1. Dessiner le glyphe dans une cellule libre de 64 px de `assets/ui/buttons/icons.png` (512 x 256 px, 32 cellules), blanc pour un glyphe à une couleur (gris clair en plus pour l'ombrage). Un glyphe en couleurs va aussi dans `GameIcon.MULTICOLOR`.
2. Ajouter l'id à la fin de l'enum `GameIcon.Id`, dans l'ordre des cellules: insérer au milieu décalerait toutes les cellules suivantes et les valeurs numériques déjà enregistrées dans les `.tscn`.
3. Ajouter les lignes `BUTTON.<ID>` (en, fr) à `translations.csv`, puis lancer l'import headless pour régénérer les `.translation`.
4. Lancer les tests: `test_translations.gd` vérifie que chaque `BUTTON.<ID>` a un texte anglais et français non vide, `test_game_icon.gd` que chaque cellule est dessinée, distincte et dans l'atlas.

### Contrôles qui ne sont pas des `GameButton`

Les cartes de construction (`TextureButton` des scènes `build_card_bat_XX`), les cartes de l'armurerie (`CardTextureButton`, dont le bouton d'achat est lui un `GameButton` `BANNER`), les zones d'onglets de l'encyclopédie (`TowersButton`, `EnemiesButton`) et les indicateurs de niveau (`LevelIndicator`) sont des `TextureButton` avec leur propre dessin. Ils reçoivent `ButtonEffects` directement.

## Popups

`PopupSpawner` (`ui/popups/popup_spawner.gd`, un `Marker2D` porté par `ILevel` et par les ennemis) crée les textes flottants:

- `display_damage(amount: float, color: Color = Color.WHITE, tower: ITower = null, is_critical: bool = false)`: dégâts. Quand `tower` est valide, sa couleur de `TOWER_COLORS` (par `tower_id`) remplace `color`, et une tour avec `use_accumulative_popups` additionne les coups dans un seul `DamagePopup`. `IEnemy.take_damage()` passe la tour qui a porté le coup.
- `score(text)`: texte qui monte de 16 px.
- `wave(text)`: bandeau de vague, ajouté à `Global.ui`.

## Effets d'écran

| Shader (`assets/shaders/`) | Utilisation |
|---|---|
| `health_bar_scaling.gdshader` | Barre de vie du HUD |
| `low_health_vignette.gdshader` | `LowHealthIndicator`: vignette rouge pulsante quand la vie passe à 25 % ou moins |
| `radial_aura.gdshader` | Halo de l'écran de découverte d'un ennemi |
| `flat_alpha_tint.gdshader` | Silhouette noire de l'ennemi à découvrir |

`NewEnemyChallenger` joue l'écran de découverte quand un ennemi apparaît pour la première fois: `WaveStepSpawn` appelle `Global.ui.notify_new_enemy_reveal` puis `ProgressionManager.mark_enemy_seen`. Le HUD demande la source `&"new_enemy"` pendant l'animation et les révélations se jouent l'une après l'autre. Quand la file est vide, le HUD lance le dialogue unique `first_boss` (pour `big_daddy`) ou `first_new_enemy` (autre ennemi que `default_zombie`).

## Encyclopédie

`Encyclopedia` (`ui/menus/encyclopedia/encyclopedia.gd`) est ouverte depuis l'accueil et depuis le menu pause. Elle a deux catégories, `ENEMIES` et `TOWERS`, et tourne les pages avec précédent et suivant.

- Les entrées viennent de `StatsDB.get_tower_ids()` et `get_enemy_ids()`: scène, stats ([Statistiques](/documentation/development/models/stats-model/)). Le nom est la clé `StatsDB.name_key("TOWER", id)` ou `name_key("ENEMY", id)`. Une entrée dont la scène n'existe pas est ignorée avec un avertissement.
- Ennemis: vie, récompense, vitesse, plus les champs de `extra` (portée, cadence, durée d'étourdissement, délais d'attaque). Tours: coût, dégâts, cadence, portée. Les libellés sont les clés `ENCYCLOPEDIA.STATS.*`.
- La grille de stats (`stats_grid`) est déclarée avec `mouse_behavior_recursive` désactivé dans `encyclopedia.tscn`: les libellés et conteneurs que le script y ajoute n'ont pas besoin de régler leur `mouse_filter`.
- L'aperçu de chaque entrée vient de `SpritePreview.from_scene()`, mis en cache dans l'entrée.
- Un ennemi est découvert quand `ProgressionManager.is_enemy_seen(id)` est vrai, une tour quand `ProgressionManager.is_tower_unlocked(id)` l'est. Sinon la page affiche `?`, la silhouette noire de l'aperçu et `ENCYCLOPEDIA.NOT_DISCOVERED`.
- Afficher une entrée découverte la marque comme lue (`mark_enemy_encyclopedia_seen`, `mark_tower_encyclopedia_seen`, drapeau `encyclopedia_seen`). Un point d'exclamation signale les entrées non lues, sur l'accueil, la pause et les catégories.

Les drapeaux sont dans [Progression et sauvegarde](/documentation/development/models/progression-model/).
