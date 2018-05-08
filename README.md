# keystroke

Keymap from keystroke to keystroke in your `keymap.cson`.

**RULE: Command name must start with `keystroke<space>`**.

```coffeescript
'atom-text-editor':
  'ctrl-a': 'keystroke ctrl-e ctrl-p'

'atom-text-editor.vim-mode-plus.normal-mode':
  'space j': 'keystroke 5 j'
  'space k': 'keystroke 5 k'
```


# What is happening under the hood.

- When `keymap.cson` was loaded, collect `keystroke ` prefixed commands from loaded keymaps.
- Register these commands automatically.

# Two way to reigster keystroke command

For historical reason, there is two way to register keystroke commands.

- [New and auto]: Automatically register keystroke commands from loaded user's keymaps.
- [Old and manual]: Manually register keystroke commands from `keystroke.commands` configuration( older way ).

## [New and auto] auto register via `keymap.cson`

- `keymap.cson`

```coffeescript
'atom-text-editor':
  'ctrl-cmd-c': 'keystroke ctrl-shift-w backspace'

'atom-text-editor.vim-mode-plus.normal-mode':
  'C': 'keystroke c i w'
```

## [Old and manual] manual register via `config.cson`

- `config.cson`

```coffeescript
"*":
  "keystroke":
    commands: [
      {
        name: "delete-current-word"
        keystroke: "ctrl-shift-w backspace"
        scope: 'atom-workspace' # atom-workspace is default, just for demo.
      }
      {
        name: "change-inner-word"
        keystroke: "c i w" # using vim-mode-plus keymap
      }
    ]
```

- `keymap.cson`

```coffeescript
'atom-text-editor':
  'ctrl-cmd-c': 'keystroke:delete-current-word'

'atom-text-editor.vim-mode-plus.normal-mode':
  'C': 'keystroke:change-inner-word'
```

# [experimental] Service

Currently just provide `buildCommandSpecsFromKeyBindings` function only.  
Which can be used to process keymap file bundled in your developing package.  

I'll explain with `example-pkg` package which bundles it's own keymap in `keymaps/example-pkg.cson` file.

You have to do TWO things.

1. Subscribe to keystroke's service by adding info in your `package.json`.  
2. Add `consumeKeystroke` function in your package's main file.  


- package.json: `consumeKeystorke` of your pkg's main file is called when keystorke pkg become available

```json
  "consumedServices": {
    "keystroke": {
      "versions": {
        "^1.0.0": "consumeKeystroke"
      }
    },
  },
```

- Pkg's main file: Register keystroke commands from keymap file bundled in your pkg

```javascript
  activate() {
    this.keystrokeCommands = new CompositeDisposable()
  },

  deactivate() {
    this.keystrokeCommands.dispose()
  },

  consumeKeystroke(service) {
    // get it's own keymap filePaths
    const filePaths = atom.packages.getLoadedPackage("example-pkg").getKeymapPaths()
    for (const filePath of filePaths) {
      this.keystrokeCommands.add(service.registerKeystrokeCommandsFromFile(filePath))
    }
  },
```
