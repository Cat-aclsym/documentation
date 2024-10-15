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
8. [Core Functions](#function-ordering-and-naming)
    - `_init()`
    - `_enter_tree()`
    - `_ready()`
    - `_process(delta: float)`
    - `_physics_process(delta: float)`
    - `_draw()`
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
class_name ILevel
extends Node2d
## Interface for level class. All levels node inherit for this node.
##
## The description of the script, what it can do,
## and any further detail.
##
## @tutorial:             https://example.com/tutorial_1
## @tutorial(Tutorial 2): https://example.com/tutorial_2
## @experimental
## © [2024] A7 Studio. All rights reserved. Trademark.
```
- Use tags if needed :

| Description  | No tag.                                                        |
| ------------ | -------------------------------------------------------------- |
| Deprecated   | `@deprecated`<br></br>`@deprecated: Use [member another] instead.`  |
| Experimental | `@experimental`<br></br>`@experimental: This method is incomplete.` |

- Use `@tutorial` tag to redirect to external documentation

### Signals

- **Signal Declarations:** Use `snake_case` for signal names.
  - Example:
```python
signal my_signal
```

### Enums

- **Naming Conventions:**
  - Enums should be named using `PascalCase`.
  - Enum values should be in `ALL_CAPS`.
  - Include a trailing comma for multiline enum declarations.
  - Example:
```python
enum MyEnum {
    VALUE_ONE,
    VALUE_TWO,
    VALUE_THREE,
}
```

### Constants

- **Naming Conventions:**
  - Constants should be named in `ALL_CAPS`, with underscores (`_`) separating words.
  - Example:
```python
const MAX_HEALTH: int = 100
```

### Variables

- **Naming Conventions:**
  - Public variables should be in `snake_case`.
  - Private variables should start with an underscore (`_`) and follow `snake_case`.
  - **No exceptions** to the above rules.
  - If unsure whether a variable should be private or public, **make it private** and change it later if needed.
  - Avoid redundant type declarations when using implicit typing.
  - Example:
```python
var public_var: int = 10
var _private_var: int
var _implicit_type := Vector2(0, 1)  # Preferred
var _redundant_type: Vector2 = Vector2(0, 1)  # Avoid
```

- **Exported Variables:**
  - Use the `@export` keyword for exported variables, and name them in `snake_case`.
  - Example:
```python
@export var my_exported_var: String = "Hello World!"
@export_enum("Option1", "Option2") var my_enum_var: String
```

### Function Ordering and Naming

- **Function Order:**
  1. Core functions in order:
      1. `_init()`
      2. `_enter_tree()`
      3. `_ready()`
      4. `_process(delta: float)`
      5. `_physics_process(delta: float)`
      6. `_draw()`
  2. Public functions (class methods)
  3. Private functions
  4. Signal callbacks

> **Tip:** Adding comments such as `#core`, `#public`, `#private`, `#signal` between each section can improve readability.

- **Function Naming:**
  - Use `snake_case` for function names.
  - Private functions should start with an underscore (`_`).
  - **Always** specify the function return type, even for core functions.
  - **Always** specify parameter types.
  - Example:
```python
func my_public_function() -> int:
    return some_value

func _my_private_function(my_param: int) -> void:
    pass
```

- **Signal Callback Functions:**
  - Name signal callback functions in the format `_on_<NodeName>_<signal_name>()`.
  - Example:
```python
func _on_Player_died() -> void:
    print("Player has died.")
```

### Function Parameters and Return Types

- **Always specify return types and parameter types.**
- **Underscore for Unused Parameters:**
  - Prefix parameters with an underscore (`_`) if they are not used within the function.
  - Example:
```python
func _process(_delta: float) -> void:
    pass
```

- **Avoiding `Variant`:**
  - Avoid using the `Variant` type unless absolutely necessary. Always document what the function returns when using `Variant`.
  - Example:
```python
# @return: Player instance or null
func get_player_if_ready() -> Variant:
    if Global.player != null:
        return Global.player
    return null
```

---

## Documentation

- In gdscript `##` is used for documentation and `#` for comments
- Documentation must precede a var or a function declaration to have any effect
- If documenting a script it should be place right after `class_name X extends Y`
- **All public functions must be documented**, following the Godot documentation recommendations : https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_documentation_comments.html
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
- Use `@deprecated` and `@experimental` tags :

| Description  | No tag.                                                        |
| ------------ | -------------------------------------------------------------- |
| Deprecated   | `@deprecated`<br></br>`@deprecated: Use [member another] instead.`  |
| Experimental | `@experimental`<br></br>`@experimental: This method is incomplete.` |

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
- Use `@tutorial` tag to redirect to external documentation

---

## Code Practices

- **Ternary Operators:**
  - Ternary operators are acceptable but must remain easy to read.
  - Example:
```python
return 1 if condition else 2
```
  - **No nested ternary operators is allowed**. _(i will find you and kill you)_
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
  - Limit the use of global variables.
  - If there is no simpler way and the resource is lightweight, use a global variable.
  - **Always verify a global variable before accessing it**.
  - Example:
```python
if Global.player != null:
    Global.player.do_something()
```

- **Signal Connections:**
  - Prefer connecting signals from code rather than using the Godot UI (though the latter is still acceptable).
  - Always use functions to connect signals instead of writing connection logic directly in core functions like `_ready`.
  - Example:
```python
func _ready() -> void:
    _connect_signals()

func _connect_signals() -> void:
    connect("my_signal", _on_MyNode_my_signal)
```

- **Functions:**
  - A function must do **one thing**.
  - A function should **never** crash the game.
  - Use `assert(condition, error_message)` to ensure correct usage by future developers.
  - `assert` raises an error if the condition fails.
  - Example:
```python
func square_root(number: float) -> float:
    assert(number > 0, "You can't calculate the square root of a negative number")
    return sqrt(number)
```
  - Avoid using the `Variant` type unless necessary:
      - Its usage must be justified.
      - A comment should clarify the possible types returned.
      - Use `assert` to ensure correct typing by other developers.
  - `eval` like code are not allowed:
      - It can still be used in specific scenario : debug / test scripts 
  - Example:
```python
# not fucking allowed, it is a hell to debug
# can still be used for debug or test scripts
func _ready() -> void:
    var new_script := Script.new()
    new_script.source_code = "static func test_func():\nprint('Hello World!')"
    new_script.reload()
    new_script.test_func()
```
- **Default parameters values are never allowed in functions** 

---

## TODO

1. **Log and Error Handling:**
   - Guidelines on handling errors, including the use of `assert`, and custom error messages.

2. **Testing:**
   - Best practices for writing testable code, unit tests, and integration tests in Godot.

3. **Version Control / Git Flow:** 
   - Rules on maintaining scripts in version control systems using whatever shitty software Pierre want instead of basic Git terminal.

4. **Resource Management:**
   - Rules for managing and optimizing resources like textures, audio, and scripts in large projects.

5. **Performance Optimization:**
   - Tips on writing efficient GDScript code, profiling tools, and common performance pitfalls.

6. **Team Collaboration:**
   - Guidelines for collaborating with other developers, including code reviews, pair programming, and shared coding standards.

7. **Naming Conventions for Other Resources:**
   - Naming conventions for scenes, nodes, and other non-script resources.