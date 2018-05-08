const {CompositeDisposable} = require('atom')
const {dispatchKeystroke} = require('./utils')

module.exports = {
  activate () {
    const userKeymapPath = atom.keymaps.getUserKeymapPath()
    this.subscriptions = new CompositeDisposable(
      atom.config.observe('keystroke.commands', commandSpecs => this.onConfigChange(commandSpecs)),
      atom.keymaps.onDidLoadUserKeymap(() => this.onKeymapLoaded()),
      atom.keymaps.onDidReloadKeymap(({path}) => {
        if (path === userKeymapPath) this.onKeymapLoaded()
      })
    )
  },

  deactivate () {
    if (this.configCommandsDisposable) this.configCommandsDisposable.dispose()
    if (this.userKeymapCommandsDisposable) this.userKeymapCommandsDisposable.dispose()
    this.subscriptions.dispose()
  },

  onConfigChange (commandSpecs) {
    if (this.configCommandsDisposable) this.configCommandsDisposable.dispose()
    for (const commandSpec of commandSpecs) {
      // Complemente commands prefix.
      commandSpec.name = 'keystroke:' + commandSpec.name
    }
    this.configCommandsDisposable = this.registerCommands(commandSpecs)
  },

  onKeymapLoaded () {
    if (this.userKeymapCommandsDisposable) this.userKeymapCommandsDisposable.dispose()
    this.userKeymapCommandsDisposable = this.registerKeystrokeCommandsFromFile(atom.keymaps.getUserKeymapPath())
  },

  registerKeystrokeCommandsFromFile (filePath) {
    const keyBindings = atom.keymaps.getKeyBindings().filter(keyBinding => keyBinding.source === filePath)

    const commandSpecs = keyBindings
      .filter(keyBinding => keyBinding.command.startsWith('keystroke '))
      .map(({command, selector: scope}) => ({name: command, keystroke: command.replace(/^keystroke /, ''), scope}))
    return this.registerCommands(commandSpecs)
  },

  registerCommands (commandSpecs) {
    const commandsByScope = {}
    let running = false

    for (const {name, keystroke, scope = 'atom-workspace'} of commandSpecs) {
      if (!commandsByScope[scope]) {
        commandsByScope[scope] = {}
      }
      commandsByScope[scope][name] = event => {
        // Avoid executed keystroke also re-mapped recursively.
        if (running) {
          event.abortKeyBinding()
        } else {
          running = true
          dispatchKeystroke(keystroke)
          running = false
        }
      }
    }

    return new CompositeDisposable(
      ...Object.keys(commandsByScope).map(scope => atom.commands.add(scope, commandsByScope[scope]))
    )
  },

  provideKeystroke () {
    return {
      registerKeystrokeCommandsFromFile: this.registerKeystrokeCommandsFromFile.bind(this)
    }
  }
}
