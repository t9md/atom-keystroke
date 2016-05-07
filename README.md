# keystroke

Define multi-keysroke as command.

# example

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
        keystroke: "c i w" # using vim-mode or vim-mode-plus keymap
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
