---
title: Coding Guideline
sidebar_position: 1
description: GDScript coding guideline
---

# Coding Guideline

---

## Script Structure

All scripts must adhere to the following structure :

1. [Header](#header)
2. [class_name + extends](#class_name-extends)
3. [Enums](#enums)
4. [Constants](#constants)
5. [Exported Variables](#variables)
6. [Public Variables](#variables)
7. [Private Variables](#variables)
8. [Core Functions](#function-ordering)
9. [Public Functions (class methods)](#function-ordering-and-naming)
10. [Private Functions](#function-ordering-and-naming)
11. [Signal Callbacks](#function-ordering-and-naming)

### Header

- **Every** file must start with the following header:
- Example :
```python
## © [2024] A7 Studio. All rights reserved. Trademark.
```
- The header must be specialized if it is for an important script, such as interface (e.g `ilevel.gd`) otherwise it can be exempted.
- Example:
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

You can use tags `@tutorial` to redirect to external documentation, `@experimental` to indicate that the script is still in development or `@deprecated` to indicate that the script is no longer used.
Check out the full documentation of how to write documentation [here](#documentation).

### Function Ordering

1. Core functions in order:
    1. `_init()` - Constructor
    2. `_enter_tree()` - Called when the node enters the scene tree
    3. `_ready()` - Called when the node is added to the scene tree
    4. `_process(delta: float)` - Called every frame
    5. `_physics_process(delta: float)` - Called every physics frame
    6. `_draw()` - Called every frame only in 2D nodes
2. Public functions (class methods)
3. Private functions
4. Signal callbacks

> **Tip:** Adding comments such as `#core`, `#public`, `#private`, `#signal` between each section can improve readability if you have a lot of functions.

## Type Annotations

We always type our variables and functions.
This makes the code easier to read and understand and helps catch bugs early.
Use `assert` to ensure correct usage by future developers.

### Variables

Prefer writing explicit type for numbers as one statement can be misleading.

- Example:
```python
var public_var: int = 10  # Can be an int or a float, so use explicit type
var _private_var: int  # No default value

var _implicit_type := Vector2(0, 1)  # Preferred
var _redundant_type: Vector2 = Vector2(0, 1)  # Avoid
```

### Function Parameters and Return Types

- **Always specify return types and parameter types.**

- **Avoiding `Variant`:**
  - Avoid using the `Variant` type unless absolutely necessary. Always document what the function returns when using `Variant`.
  - Example:
```python
## Returns [code]Player[/code] or [code]null[/code]
func get_player_if_ready() -> Variant:
    if Global.player != null:
        return Global.player
    return null
```

---

## Documentation

- In gdscript `##` is used for the documentation and `#` for comments.
- Documentation must precede a var or a function declaration to have any effect.
- If documenting a script, it should be placed below `class_name X extends Y`.
- **All public functions must be documented**, following the Godot documentation recommendations: https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_documentation_comments.html
- Example:
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

- **Private functions documentation can be omitted**, except if:
    - The function can fail (ideally, no function should fail).
    - The function can throw exceptions.
    - The function is critical
- Use the following tags to document your code:

| Name         | Description                                                                                                                |
|--------------|----------------------------------------------------------------------------------------------------------------------------|
| [Reference]  | Link to the class `[ILevel]`, the method `[method ILevel.thing]`.<br>The image `[img width=32]res://local-file.png[/img]`. |
| Deprecated   | `@deprecated`<br>`@deprecated: Use [member another] instead.`                                                              |
| Experimental | `@experimental`<br>`@experimental: This method is incomplete.`                                                             |
| Tutorial     | `@tutorial: https://example.com/tutorial`<br>`@tutorial(Tutorial 2): https://example.com/tutorial_2`                       |                                       

Check out full documentation on [GDScript documentation comments](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_documentation_comments.html).

- Example:
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

## Code Practices

- **Ternary Operators:**
  - Ternary operators are acceptable but must remain easy to read.
  - Example:
```python
return 1 if condition else 2
```
  - No nested ternary operators are allowed because they make the code harder to read, consider using conditions.
  - Example:
```python
return 1 if condition1 else (2 if condition2 else 3)  # Not allowed
```
- **Avoid Deep Nesting**
    - **Minimize Indentation Levels:** Deep nesting makes code harder to read and maintain. Instead of using multiple nested `if` statements, use guard clauses or early returns to keep the code flat and readable.
    - **Use early returns to avoid unnecessary nesting:**
- Instead of writing:
```python
if condition:
    # some deeply nested logic
    if another_condition:
        # more nested logic
        if yet_another_condition:
            # even deeper logic
```
- Refactor using guard clauses:
```python
if not condition:
    return

if not another_condition:
    return

if not yet_another_condition:
    return

# Logic here is now cleaner and avoids deep indentation
```

- **Limiting Global Variables:**
  - Only use global variables when necessary.
  - Always verify a global variable before accessing it as it may not be initialized.

Example:
```python
if Global.player != null:
    Global.player.do_something()
```

- **Static Variables and Functions:**
  - Use static variables and functions when the same data or logic is shared across all instances of a class and depends only on the class itself.
  - Use the `static` keyword to define static variables and functions.

Example:
```python
static var _instance_count: int = 0

static func get_instance_count() -> int:
	return _instance_count
	
func _ready() -> void:
	_instance_count += 1
```

- **Signal Connections:**
  - Prefer connecting signals from code rather than using the Godot UI to easily find connected signals.
  - Always use functions to connect signals instead of writing connection logic directly in core functions like `_ready`.

Example:
```python
func _ready() -> void:
    _connect_signals()

func _connect_signals() -> void:
    connect("my_signal", _on_MyNode_my_signal)
```

- **Functions:**
  - A function must do **one thing**.
  - Use `assert(condition, error_message)` to ensure correct usage by future developers, it will raise an error if the condition is not met.

Example:
```python
func square_root(number: float) -> float:
    assert(number > 0, "You can't calculate the square root of a negative number")
    return sqrt(number)
```

- **Default parameters values are never allowed in functions** 

---

## Naming Conventions

### Files

- Use `snake_case` for script names, scenes and folders.
- Use `PascalCase` for class names.

Example:
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

### Signals

- Use `snake_case` for signal names and their parameters.

Example:
```python
signal my_signal

signal player_killed(enemy: Node)
```

### Enums

- Enums should be named using `PascalCase`.
- Enum values should be in `ALL_CAPS`.
- Include a trailing comma for multiline enum declarations.

Example:
```python
enum MyEnum {
    VALUE_ONE,
    VALUE_TWO,
    VALUE_THREE,
}
```

### Constants

- Constants should be named in `ALL_CAPS`, with underscores (`_`) separating words.

Example:
```python
const MAX_HEALTH: int = 100
```

### Variables

- Public variables should be in `snake_case`.
- Private variables should start with an underscore (`_`) and follow `snake_case`.
- If unsure whether a variable should be private or public, **make it private** and change it later if needed.

Example:
```python
var public_var: int = 10
var _private_var: int
var _implicit_type := Vector2(0, 1)  # Preferred
var _redundant_type: Vector2 = Vector2(0, 1)  # Avoid
```

- Use the `@export` keyword for exported variables, and name them in `snake_case`.

Exemple:
```python
@export var my_exported_var: String = "Hello World!"
@export_enum("Option1", "Option2") var my_enum_var: String
```

### Functions

- Use `snake_case` for function names.
- Private functions should start with an underscore (`_`).
- **Always** specify the function return type, even for core functions.
- **Always** specify the parameter types.
- Prefix parameters with an underscore (`_`) if they are not used within the function (but avoid these cases).

Example:
```python
func my_public_function() -> int:
    return some_value

func _my_private_function(my_param: int) -> void:
    pass
    
func _process(_delta: float) -> void:
    pass
```

- Name signal callback functions in the format `_on_<NodeName>_<signal_name>()`.

Example:
```python
func _on_Player_died() -> void:
    print("Player has died.")
```

## Resources Management

- **Resource Paths:**
  - Use `res://` for all resource paths.
  - Avoid using absolute paths.

Example:
```python
var texture = preload("res://textures/my_texture.png")
```

- **Resource Loading:**
  - Use `preload` to load resources.
  - Preload resources at the start of the script.

Example:
```python
var texture = preload("res://textures/my_texture.png")
```

Avoid dynamic loading of resources in functions as it can cause performance issues.
Avoid changing the resource of a node at runtime (ex: images, sounds, etc.), as it can cause memory leaks.

- **New resources:**
  - Optimize images in a tool like [TinyPNG](https://tinypng.com/) before importing them into Godot, prefer using WebP or SVG formats.
  - SVG support is limited, always try them on [ThorVG](https://www.thorvg.org/viewer) before importing them into Godot as it uses the same engine.
  - Use `Nearest` texture mode for sprites with pixel art sprites.

## Git Guidelines

Follow the [Git Guidelines](git-guidelines.md) for version control.
Check out the documentation on [Gitflow Workflow](git-workflow.md) for how to create branches and manage your code.

## TODO

1. **Log and Error Handling:**
   - Guidelines on handling errors, including the use of `assert`, and custom error messages.

2. **Testing:**
   - Best practices for writing testable code, unit tests, and integration tests in Godot.

3. **Performance Optimization:**
   - Tips on writing efficient GDScript code, profiling tools, and common performance pitfalls.

4. **Team Collaboration:**
   - Guidelines for collaborating with other developers, including code reviews, pair programming, and shared coding standards.
