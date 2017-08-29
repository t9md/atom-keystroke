# keystroke

Keymap from keystroke to keystroke in your `keymap.cson`.

```coffeescript
'atom-text-editor':
  'ctrl-a': 'keystroke ctrl-e ctrl-p'

'atom-text-editor.vim-mode-plus.normal-mode':
  'space j': 'keystroke 5 j'
  'space k': 'keystroke 5 k'
```

**RULE: Command name must start with `keystroke `**.

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

## [Old and manual] manual register via `keystroke.commands`

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
