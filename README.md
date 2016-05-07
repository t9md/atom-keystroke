# keystroke

Define multi-keysroke as command.

# example

```coffeescript
"*":
  "keystroke":
    commands: [
      {
        name: "change-inner-word"
        keystroke: "c i w"
      }
      {
        name: "delete-current-word"
        keystroke: "ctrl-shift-w backspace"
        scope: 'atom-workspace' # atom-workspace is default, just for demo.
      }
    ]
```
