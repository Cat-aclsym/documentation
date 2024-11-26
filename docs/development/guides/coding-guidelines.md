---
title: Coding Guideline
sidebar_position: 1
description: GDScript coding guideline
---

# Coding Guideline

---

## Structure d'un script

Tous les scripts doivent respecter la structure suivante :

1. [Header](#header)
2. class_name + extends
3. [Enums](#enums)
4. [Constantes](#constants)
5. [Variables Exportées](#variables)
6. [Variables Publiques](#variables)
7. [Variables Privées](#variables)
8. [Fonctions Intégrées](#function-ordering)
9. [Fonctions Publiques](#function-ordering)
10. [Fonctions Privées](#function-ordering)

### Header

- **Chaque** fichier doit commencer par l'en-tête suivant :
- Example :
```python
## © [2024] A7 Studio. All rights reserved. Trademark.
```
- Le header doit être détaillé s'il s'agit d'un script important, tel qu'une interface (par exemple `ilevel.gd`), sinon il peut être simple.

Exemple:
```python
## © [2024] A7 Studio. All rights reserved. Trademark.

class_name ILevel
extends Node2d
## Interface for level class. All levels node inherit for this node.
##
## The description of the class, what it can do,
## and any further detail.
##
## @tutorial:             https://example.com/tutorial_1
## @tutorial(Tutorial 2): https://example.com/tutorial_2
## @experimental
```

Vous pouvez utiliser les balises `@tutorial` pour rediriger vers une documentation externe, `@experimental` pour indiquer que le script est toujours en développement ou `@deprecated` pour indiquer que le script n'est plus utilisé.
Consultez la documentation complète sur la façon de rédiger de la documentation [ici](#documentation).

### Function Ordering

1. Fonctions de base dans l'ordre suivant :
    1. `_init()`: Constructeur
    2. `_enter_tree()`: Appelé lorsque le nœud entre dans l'arborescence de la scène
    3. `_ready()`: Appelé lorsque le nœud est ajouté à l'arborescence de la scène
    4. `_process(delta: float)`: Appelé chaque image
    5. `_physics_process(delta: float)`: Appelé chaque image physique
    6. `_draw()`: Appelé chaque image uniquement dans les nœuds 2D
2. Fonctions publiques (méthodes de classe)
3. Fonctions privées

> **Astuce :** L'ajout de commentaires tels que `#core`, `#public`, `#private`, `#signal` entre chaque section peut améliorer la lisibilité si vous avez beaucoup de fonctions.

## Annotations de Typage

- **Toujours spécifier les types de retour et les types de paramètres.**
- Cela rend le code plus facile à lire et à comprendre et permet de détecter les bogues plus tôt.
- Utilisez `assert` pour garantir une utilisation correcte de la fonction.

### Variables

Préférez écrire du typage explicites pour les nombres, car les nombres entiers sont inférés en tant que `int` mais ce principe est souvent oublié.

- Example:
```python
var public_var: int = 10  # Can be an int or a float, so use explicit type
var _private_var: int  # No default value

var _implicit_type := Vector2(0, 1)  # Preferred
var _redundant_type: Vector2 = Vector2(0, 1)  # Avoid
```

### Paramètres de fonction et types de retour

- **Spécifiez toujours les types de retour et les types de paramètres.**
- Évitez d'utiliser le type `Variant` sauf si cela est absolument nécessaire. Documentez toujours ce que la fonction renvoie lors de l'utilisation de « Variant ».

Exemple:
```python
## Returns [code]Player[/code] or [code]null[/code]
func get_player_if_ready() -> Variant:
    if Global.player != null:
        return Global.player
    return null
```

---

## Documentation

- En gdscript l'opérateur `##` est utilisé pour la documentation et `#` pour les commentaires.
- La documentation doit précéder une déclaration de variable ou de fonction pour avoir un effet.
- Si vous documentez un script, il doit être en dessous de `class_name X extends Y`.
- **Toutes les fonctions publiques doivent être documentées**, en suivant les recommandations de la documentation Godot : https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_documentation_comments.html

Exemple:
```python
## Attempts to retrieve an enemy instance by its ID.
##
## [param id] : ID of the enemy
func get_enemy_by_id(id: int) -> IEnemy:
    for enemy in _enemies:
        if enemy.id == id:
            return enemy
    
    Log.trace(Log.Level.ERROR, "Failed to get enemy with id ", id)
    return None

```

-**La documentation des fonctions privées peut être omise**, sauf si :
    - La fonction peut échouer (idéalement, aucune fonction ne devrait échouer).
    - La fonction est critique
- Utilisez les balises suivantes pour documenter votre code :

| Nom          | Exemple                                                                                                                     |
|--------------|-----------------------------------------------------------------------------------------------------------------------------|
| [Référence]  | Link to the class `[ILevel]`, the method `[method ILevel.thing]`.<br/>The image `[img width=32]res://local-file.png[/img]`. |
| Obsolète     | `@deprecated`<br/>`@deprecated: Use [member another] instead.`                                                              |
| Expérimental | `@experimental`<br/>`@experimental: This method is incomplete.`                                                             |
| Tutoriel     | `@tutorial: https://example.com/tutorial`<br/>`@tutorial(Tutorial 2): https://example.com/tutorial_2`                       |                                       

Consultez la documentation complète sur les commentaires de la [documentation GDScript](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_documentation_comments.html).

Exemple:
```python
## The description of the variable.
## @deprecated: Use [member other_var] instead.
var my_var

## If the member has any annotation, the annotation should
## immediately precede it.
@export
var v3: int = 0

## Documenting an inner class.
##
## The same rules apply here. The documentation must
## immediately precede the class definition.
##
## @tutorial: https://example.com/tutorial
## @experimental
class Inner:

    ## Inner class variable v4.
    var v4

    ## Inner class function fn.
    func fn(): pass
```

---

## Pratiques du code

- **Opérateurs ternaires :**
  - Les opérateurs ternaires sont acceptables mais doivent rester faciles à lire.

Exemple:
```python
return 1 if condition else 2
```
- Les opérateurs ternaires imbriqués ne sont pas autorisés car ils rendent le code plus difficile à lire, préférez utiliser des `if` pour les cas complexes.

Example:
```python
return 1 if condition1 else (2 if condition2 else 3)  # Not allowed
```
- **Évitez les indentations profondes**
    - **Minimisez le niveau d'indentation:** L'indentation profonde rend le code plus difficile à lire et à maintenir. Au lieu d'utiliser plusieurs instructions `if` imbriquées, utilisez des conditions préventives ou des retours anticipés pour garder le code plat et lisible.
    - **Utilisez des retours anticipés pour éviter une imbrication inutile :**
- Au lieu d'écrire:
```python
if condition:
    # some deeply nested logic
    if another_condition:
        # more nested logic
        if yet_another_condition:
            # even deeper logic
```
- Refactoriser à l'aide de retours anticipés:
```python
if not condition:
    return

if not another_condition:
    return

if not yet_another_condition:
    return

# Logic here is now cleaner and avoids deep indentation
```

- **Limiter les variables globales :**
  - N'utilisez des variables globales que lorsque cela est nécessaire.
  - Vérifiez toujours une variable globale avant d'y accéder, car elle peut ne pas être initialisée.

Exemple:
```python
if Global.player != null:
    Global.player.do_something()
```

- **Variables et fonctions statiques :**
  - Utilisez des variables et des fonctions statiques lorsque les mêmes données ou logiques sont partagées entre toutes les instances d'une classe et dépendent uniquement de la classe elle-même.
  - Utilisez le mot-clé `static` pour définir des variables et des fonctions statiques.

Exemple:
```python
static var _instance_count: int = 0

static func get_instance_count() -> int:
	return _instance_count
	
func _ready() -> void:
	_instance_count += 1
```

- **Connexions des signaux :**
  - Connectez les signaux à partir de l'utilitaire de Signaux créé.
  - Créez une liste de signaux à connecter dans `_ready()`.

Exemple:
```python
const signals: Array[Dictionary] = [
	{SignalUtil.WHO: self, SignalUtil.WHAT: "my_signal", SignalUtil.TO: _on_my_signal}
]

func _ready() -> void:
	SignalUtil.connect(signals)
```

- `SignalUtil.WHO` : L'objet qui émet le signal.
- `SignalUtil.WHAT` : Le nom du signal.
- `SignalUtil.TO` : La fonction de rappel.
- `SignalUtil.connect(signals)` : Connecte tous les signaux de la liste `signals`.

- **Fonctions :**
  - Utilisez `assert(condition, error_message)` pour garantir une utilisation correcte par les futurs développeurs, cela générera une erreur si la condition n'est pas remplie.

Example:
```python
func square_root(number: float) -> float:
    assert(number > 0, "You can't calculate the square root of a negative number")
    return sqrt(number)
```

- **Les valeurs des paramètres par défaut ne sont jamais autorisées dans les fonctions** 

---

## Conventions de nommage

### Fichiers

- Utilisez `snake_case` pour les noms de scripts, les scènes et les dossiers.
- Utilisez `PascalCase` pour les noms de classe.

Exemple:
```bash
my_script.gd
my_scene.tscn

scenes/
	my_scene/
		my_sub_scene.tscn
```

```python
# File: my_script.gd
class_name MyScript
extends Node
```

### Signaux

- Utilisez `snake_case` pour les noms de signaux et leurs paramètres.

Exemple:
```python
signal my_signal

signal player_killed(enemy: Node)
```

### Énumérations

- Les énumérations doivent être nommées en utilisant `PascalCase`.
- Les valeurs d'énumération doivent être nommées en `ALL_CAPS`.
- Incluez une virgule de fin pour les déclarations d'énumération multiligne.

Example:
```python
enum MyEnum {
    VALUE_ONE,
    VALUE_TWO,
    VALUE_THREE,
}
```

### Constantes

- Les constantes doivent être nommées en `ALL_CAPS`.

Example:
```python
const MAX_HEALTH: int = 100
```

### Variables

- Les variables publiques doivent être en `snake_case`.
- Les variables privées doivent commencer par un trait de soulignement (`_`) et être en `snake_case`.
- Si vous ne savez pas si une variable doit être privée ou publique, **rendez-la privée** et modifiez-la plus tard si nécessaire.

Exemple:
```python
var public_var: int = 10
var _private_var: int
var _implicit_type := Vector2(0, 1)  # Preferred
var _redundant_type: Vector2 = Vector2(0, 1)  # Avoid
```

- Utilisez le mot-clé `@export` pour les variables exportées et nommez-les dans `snake_case`.

Exemple:
```python
@export var my_exported_var: String = "Hello World!"
@export_enum("Option1", "Option2") var my_enum_var: String
```

### Functions

- Utilisez `snake_case` pour les noms de fonctions.
- Les fonctions privées doivent commencer par un trait de soulignement (`_`).
- Préfixez les paramètres avec un trait de soulignement (`_`) s'ils ne sont pas utilisés dans la fonction (mais évitez ces cas).

Example:
```python
func my_public_function() -> int:
    return some_value

func _my_private_function(my_param: int) -> void:
    pass
    
func _process(_delta: float) -> void:
    pass
```

## Gestion des ressources

- **Chemins de ressources :**
  - Utilisez `res://` pour tous les chemins de ressources.
  - Évitez d'utiliser des chemins absolus.

Exemple:
```python
var texture = preload("res://textures/my_texture.png")
```

- **Chargement des ressources :**
  - Utilisez `preload` pour charger les ressources.
  - Précharger les ressources au début du script.

Example:
```python
var texture = preload("res://textures/my_texture.png")
```

Évitez le chargement dynamique des ressources dans les fonctions, car cela peut entraîner des problèmes de performances.
Évitez de modifier la ressource d'un nœud au moment de l'exécution (ex : images, sons, etc.), cela peut provoquer des fuites de mémoire.

- **Nouvelles ressources :**
  - Optimisez les images dans un outil comme [TinyPNG](https://tinypng.com/) avant de les importer dans Godot, préférez utiliser les formats WebP ou SVG.
  - Le support SVG est limité, essayez-les toujours sur [ThorVG](https://www.thorvg.org/viewer) avant de les importer dans Godot car il utilise le même moteur.
  - Utilisez le mode de texture `Nearest` pour les sprites avec des sprites pixel art.

## Directives Git

Suivez les [Git Guidelines](git-guidelines.md) pour le contrôle de version.
Consultez la documentation sur [Gitflow Workflow](git-workflow.md) pour savoir comment créer des branches et gérer votre code.

## À FAIRE

1. **Gestion des journaux et des erreurs :**
   - Lignes directrices sur la gestion des erreurs, y compris l'utilisation de « assert » et des messages d'erreur personnalisés.

2. **Test :**
   - Meilleures pratiques pour l'écriture de code testable, de tests unitaires et de tests d'intégration dans Godot.

3. **Optimisation des performances :**
   - Conseils sur l'écriture de code GDScript efficace, les outils de profilage et les pièges courants en matière de performances.

4. **Collaboration en équipe :**
   - Lignes directrices pour la collaboration avec d'autres développeurs, y compris les révisions de code, la programmation en binôme et les normes de codage partagées.
