# 0.4.0:
- Provide `buildCommandSpecsFromKeyBindings` as service so that external package can use `keystroke: x y z` target in their own keymapfile. 

# 0.3.0:
- Fix atom-keymap's helper import failure.
- Use standard lintting and format.

# 0.2.1:
- Improve: Don't remap recursively when from-keystroke appear in to-keystroke.
  - e.g. `"j": "keystroke 5 j"`
    - Old: `j` was recursively remapped(unusable).
    - New: Original `j`( = next matching in scoped keymap priority) command is used.
  - For vim user, this is `noremap` equivalent behavior.
# 0.2.0:
- New: Observe user's keymap and automatically register necessary commands.
  - User no longer need to define intermediate commands in `config.cson`.
  - Instead, directly define keystroke to keystroke in your `keymap.cson`.
  - README.md is updated with new-way example.
- Fix: When from-keystroke was multiple keystrokes, failed to execute keystroke correctly.
  - Now fixed by clearing queued keystroke before executing to-keystroke.
- Maintenance: Convert CoffeeScript to JavaScript
# 0.1.0:
- Initial Release
