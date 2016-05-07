# keystroke

Define multi-keysroke as command.

# example

```coffeescript
"*":
  "keystroke":
    commands: [
      {
        name: "change-inner-word"
        keystroke: "c i w" # using vim-mode or vim-mode-plus keymap
      }
      {
        name: "delete-current-word"
        keystroke: "ctrl-shift-w backspace"
        scope: 'atom-workspace' # atom-workspace is default, just for demo.
      }
    ]
```
