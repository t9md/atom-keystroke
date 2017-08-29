const {CompositeDisposable} = require("atom")
const {dispatchKeystroke} = require("./utils")

module.exports = {
  activate() {
    this.subscriptions = new CompositeDisposable(
      atom.config.observe("keystroke.commands", commandSpecs => this.onConfigChange(commandSpecs)),
      atom.config.observe("keystroke.autoLoadCommandsFromUserKeymap", enabled => this.toggleObserveUserKeymaps(enabled))
    )
  },

  deactivate() {
    if (this.userKeymapObserver) this.userKeymapObserver.dispose()
    if (this.commandsDisposable) this.commandsDisposable.dispose()
    if (this.autoCommandsDisposable) this.autoCommandsDisposable.dispose()
    this.subscriptions.dispose()
  },

  toggleObserveUserKeymaps(enabled) {
    if (this.userKeymapObserver) this.userKeymapObserver.dispose()
    if (!enabled) return

    const userKeymapPath = atom.keymaps.getUserKeymapPath()
    this.userKeymapObserver = new CompositeDisposable(
      atom.keymaps.onDidLoadUserKeymap(() => this.onKeymapLoaded()),
      atom.keymaps.onDidReloadKeymap(({path}) => {
        if (path === userKeymapPath) this.onKeymapLoaded()
      })
    )
  },

  onConfigChange(commandSpecs) {
    if (this.commandsDisposable) this.commandsDisposable.dispose()
    for (const commandSpec of commandSpecs) {
      // Complemente commands prefix.
      commandSpec.name = "keystroke:" + commandSpec.name
    }
    this.commandsDisposable = this.registerCommands(commandSpecs)
  },

  onKeymapLoaded() {
    if (this.autoCommandsDisposable) this.autoCommandsDisposable.dispose()
    this.autoCommandsDisposable = this.registerCommands(this.buildCommandSpecsFromUserKeymap())
  },

  buildCommandSpecsFromUserKeymap() {
    const filePath = atom.keymaps.getUserKeymapPath()
    return atom.keymaps
      .getKeyBindings()
      .filter(keyBinding => keyBinding.source === filePath && keyBinding.command.startsWith("keystroke "))
      .map(({command, selector: scope}) => ({name: command, keystroke: command.replace(/^keystroke /, ""), scope}))
  },

  registerCommands(commandSpecs) {
    const commandsByScope = {}
    for (const {name, keystroke, scope = "atom-workspace"} of commandSpecs) {
      if (!commandsByScope[scope]) {
        commandsByScope[scope] = {}
      }
      commandsByScope[scope][name] = () => dispatchKeystroke(keystroke)
    }

    return new CompositeDisposable(
      ...Object.keys(commandsByScope).map(scope => atom.commands.add(scope, commandsByScope[scope]))
    )
  },
}
