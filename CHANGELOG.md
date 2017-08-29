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
