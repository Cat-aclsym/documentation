---
title: Dialogues avec Dialogic
description: Utiliser Dialogic 2 pour les dialogues, le tutoriel et l'armurerie de Cat'aclysm
sidebar:
  label: Dialogic
  order: 20
---

Dialogic porte les dialogues du tutoriel et de l'armurerie. La [documentation officielle](https://docs.dialogic.pro/) couvre l'éditeur et la syntaxe des timelines.

Le plugin (2.0-Alpha-19, Godot 4.4+) est fourni dans `addons/dialogic/` et activé: rien à installer. `Dialogic` est un autoload (`addons/dialogic/Core/DialogicGameHandler.gd`).

## Fichiers du projet

Les ressources narratives sont dans `res://assets/narrative/`:

- `armory_intro.en.dtl` et `armory_intro.fr.dtl`: dialogue d'introduction de l'armurerie
- `tutorial_level_01.en.dtl` et `tutorial_level_01.fr.dtl`: tutoriel du premier niveau
- `character1.dch`: personnage du guide, nommé Whiskas
- `whiskas.png`, `whiskas_amazed.png`, `whiskas_worry.png`: portraits du personnage
- `style.tres`: style et layout

Whiskas, le guide du tutoriel et de l'armurerie, a trois portraits (l'humeur est donnée entre parenthèses dans la timeline, comme `character1 (Neutral)`):

| Portrait | Humeur | Fichier |
|---|---|---|
| ![Whiskas, humeur neutre](/documentation/game/sprites/sprite-whiskas-neutral.png) | `Neutral` (par défaut) | `whiskas.png` |
| ![Whiskas, étonné](/documentation/game/sprites/sprite-whiskas-amazed.png) | `Amazed` | `whiskas_amazed.png` |
| ![Whiskas, inquiet](/documentation/game/sprites/sprite-whiskas-worry.png) | `Worry` | `whiskas_worry.png` |

Les timelines du projet n'utilisent que `Neutral`.

Chaque `.dtl` et `.dch` est enregistré dans `project.godot`, sous `[dialogic]`, dans `directories/dtl_directory` et `directories/dch_directory`. Le fichier `scenes/narrative/example/dialogic_example.gd` démarre une timeline `example` qui n'existe pas: cette scène d'exemple ne fonctionne pas.

## Écrire une timeline

Exemple tiré de `armory_intro.fr.dtl`:

```text
join character1 (Neutral) center
character1 (Neutral): Bienvenue dans l'Armurerie !
leave character1 [animation="Fade Out" wait="true"]
[end_timeline]
```

## Signaux depuis une timeline

Une timeline peut notifier le code avec un événement signal, nommé `namespace:event`:

```text
[signal arg="tutorial:open_build_menu"]
```

Le code écoute `Dialogic.signal_event` et `Dialogic.timeline_ended`. Le `TutorialManager` écoute aussi `Dialogic.event_handled`.

## Intégration GDScript

Le projet utilise une timeline par langue (`.en.dtl`, `.fr.dtl`). Deux scripts choisissent le fichier de façon différente.

L'armurerie choisit le fichier selon `TranslationServer.get_locale()` et retombe sur l'anglais si le fichier de la langue n'existe pas (extrait de `armory.gd`):

```gdscript
func _get_armory_intro_path() -> String:
	var locale: String = TranslationServer.get_locale().substr(0, 2)
	var path: String = "res://assets/narrative/armory_intro.%s.dtl" % locale
	if not FileAccess.file_exists(path):
		path = "res://assets/narrative/armory_intro.en.dtl"
	return path

func _on_help_button_pressed() -> void:
	Dialogic.start(_get_armory_intro_path())
```

Le tutoriel ne teste pas l'existence du fichier : `TutorialManager` choisit entre deux constantes, le français si la langue commence par `fr`, l'anglais sinon :

```gdscript
func _get_timeline_path() -> String:
	return TIMELINE_FR_PATH if TranslationServer.get_locale().to_lower().begins_with("fr") else TIMELINE_EN_PATH
```

`Dialogic.start` accepte un chemin (armurerie) ou une ressource de timeline déjà chargée (tutoriel : `Dialogic.start(load(path))`).

Écoute des signaux, comme dans `TutorialManager`:

```gdscript
SignalUtil.connects([
	{SignalUtil.WHO: Dialogic, SignalUtil.WHAT: "signal_event", SignalUtil.TO: _on_dialogic_signal_event},
	{SignalUtil.WHO: Dialogic, SignalUtil.WHAT: "timeline_ended", SignalUtil.TO: _on_dialogic_timeline_ended},
	{SignalUtil.WHO: Dialogic, SignalUtil.WHAT: "event_handled", SignalUtil.TO: _on_dialogic_event_handled},
])
```

### Pause d'un dialogue

`Dialogic.paused` suspend le déroulement de la timeline. Le tutoriel le passe à `true` pendant qu'il attend une action du joueur (par exemple l'ouverture du menu de construction), puis à `false` pour reprendre le dialogue.

### Layout

Le `TutorialManager` règle le layout Dialogic au démarrage du tutoriel : si c'est un `CanvasLayer`, `layer = 100` ; sinon `z_index = 9000`. Il est ainsi affiché au-dessus de l'interface du niveau.

Voir aussi le [Tutoriel](/documentation/development/guides/tutorial/).

## Traductions des dialogues

Le projet utilise un fichier `.dtl` par langue (voir ci-dessus). La traduction de Dialogic est en plus activée dans `project.godot` (`translation/enabled=true`, `translation/original_locale="fr"`, langues `en` et `fr`, dossier `res://assets/translations`) : les deux mécanismes coexistent.

## Conventions

- Aucun texte de dialogue dans le GDScript: tout passe par des fichiers `.dtl`, un par langue.
- Signaux de timeline nommés `namespace:event` (par exemple `tutorial:open_build_menu`).
