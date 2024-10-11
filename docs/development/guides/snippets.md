---
title: Snippets
sidebar_position: 10
description: Documentation dashboard
---

# Snippets

## VSCode
**To create new snippet :**
1. `Ctrl + Shift + P`
2. Snippets: Configure snippets
3. gdscript.json
4. Copy past snippets 

### **Trace log** 
```json
{
    "Trace Log": {
        "prefix": "trace",
        "body": [
            "Log.trace(Log.Level.${1|DEBUG,INFO,WARN,ERROR,FATAL|}, \"$2\");"
        ],
        "description": "Insert a trace log with selectable log level"
    }
}
```

### **Base gdscript** 
```json
{
    "Base gdscript": {
        "prefix": "gdscript",
        "body": [
            "# core\n\n",
            "# public\n\n",
            "# private\n\n",
            "# signal\n\n",
            "# event\n\n",
            "# setget\n\n"
        ],
        "description": "Base structure for gdscript file"
    }
}
```