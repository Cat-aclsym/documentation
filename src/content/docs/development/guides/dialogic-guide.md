---
title: Guide Dialogic 2
description: Utiliser Dialogic 2 dans Cat'aclysm
sidebar:
  label: Guide Dialogic
  order: 30
---

Dialogic est utilisé pour créer des dialogues interactifs (narration, tutoriels, interactions contextuelles) dans Godot.

## Références officielles

- [Getting started Dialogic](https://docs.dialogic.pro/getting-started.html)
- [Documentation complète](https://docs.dialogic.pro/)
- [Releases GitHub](https://github.com/dialogic-godot/dialogic/releases)

## Plugin vendored

Dialogic 2.0-Alpha-19 (Godot 4.4+) est fourni dans `addons/dialogic/` et activé dans le projet: il n'y a rien à télécharger ni à installer.
`Dialogic` est un autoload du projet (`addons/dialogic/Core/DialogicGameHandler.gd`).

Ne pas modifier `addons/` sauf pour une mise à jour explicite du plugin.

## Fichiers du projet

Les ressources narratives sont dans `res://assets/narrative/`:

- `armory_intro.en.dtl` et `armory_intro.fr.dtl`: dialogue d'introduction de l'armurerie
- `tutorial_level_01.en.dtl` et `tutorial_level_01.fr.dtl`: tutoriel du premier niveau
- `character1.dch`: personnage du guide
- `style.tres`: style et layout

Toutes les ressources `.dtl` et `.dch` sont enregistrées dans `project.godot`, sous `[dialogic]`, dans `directories/dtl_directory` et `directories/dch_directory`.
Godot génère un fichier `.uid` à côté de chacune.

## Interface Dialogic

L'onglet Dialogic de l'éditeur permet de créer des timelines et des personnages, et de prévisualiser le rendu.

## Écrire une timeline

Exemple tiré de `armory_intro.fr.dtl`:

```text
join character1 (Neutral) center
character1 (Neutral): Bienvenue dans l'Armurerie !
leave character1 [animation="Fade Out" wait="true"]
[end_timeline]
```

Référence: [Writing texts](https://docs.dialogic.pro/writing-texts.html)

## Signaux depuis une timeline

Une timeline peut notifier le code avec un événement signal, nommé `namespace:event`:

```text
[signal arg="tutorial:open_build_menu"]
```

Le code écoute `Dialogic.signal_event` et `Dialogic.timeline_ended`.

## Intégration GDScript

Une timeline par langue (`.en.dtl`, `.fr.dtl`): le code choisit le fichier selon `TranslationServer.get_locale()` et retombe sur l'anglais si le fichier n'existe pas (extrait de `armory.gd`):

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

Écoute des signaux, comme dans `TutorialManager`:

```gdscript
SignalUtil.connects([
	{SignalUtil.WHO: Dialogic, SignalUtil.WHAT: "signal_event", SignalUtil.TO: _on_dialogic_signal_event},
	{SignalUtil.WHO: Dialogic, SignalUtil.WHAT: "timeline_ended", SignalUtil.TO: _on_dialogic_timeline_ended},
])
```

Voir aussi le [Tutoriel](/documentation/development/guides/tutorial/).

## Bonnes pratiques projet

- Ne jamais écrire de texte de dialogue dans le GDScript: tout passe par des fichiers `.dtl`.
- Un fichier `.dtl` par langue.
- Nommer les signaux `namespace:event` (exemple: `tutorial:open_build_menu`).
- Enregistrer toute nouvelle ressource dans `project.godot`.
- Quand le layout Dialogic est un `CanvasLayer`, régler son ordre d'affichage avec `.layer` et non `.z_index`.
- Éviter les blocs de texte trop longs sans interaction.

## Dépannage rapide

- Timeline ne démarre pas: vérifier le chemin `res://...` et l'enregistrement dans `project.godot`.
- Effet non appliqué: vérifier la syntaxe exacte des tags Dialogic.
## Liens liés

- [Directives de code](/documentation/development/guides/coding-guidelines/)
- [Structure des fichiers](/documentation/development/guides/file-structure/)
