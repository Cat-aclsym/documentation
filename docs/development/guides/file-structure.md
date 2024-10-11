---
title: Files Structure
sidebar_position: 2
description: GDScript project files structure
---


```bash
.res://
├───addons          # Godot plugins
│   └─── ...
├───assets
│   ├───fonts
│   │   └───<font_name>
│   │       └───*.ttf
│   ├───resources   # Godot resources
│   │   ├───fonts
│   │   └───themes
│   ├───sounds
│   │   ├───vfx   
│   │   └───music
│   ├───tilemaps
│   │   ├───debug_tilemap.png
│   │   ├───terrain_tilemap.png
│   │   └─── ...
│   └───translations # Consider moving to assets/resources/
├───scenes
│   ├───main
│   │   └───main.tscn
│   └───level
│       ├───ilevel.tscn
│       └───levels
│           └───tutorial_level.tscn
├───scripts         # Script directory mirrors the scenes directory
│   ├───autoloads
│   │   └───global.gd
│   ├───main
│   └───level
│       ├───ilevel.gd
│       └───levels
│           └───tutorial_level.gd
└───project.godot
```