const {CompositeDisposable} = require("atom")
const {dispatchKeystroke} = require("./utils")

const Config = {
  autoLoadCommandsFromUserKeymap: {
    type: "boolean",
    default: true,
    dscription:
      "When `true`, each time user-keymap loaded, automatically define the commands starts with `keymaps:auto:`.",
  },
  commands: {
    type: "array",
    default: [],
    items: {
      type: "object",
      properties: {
        name: {type: "string"},
        keystroke: {type: "string"},
        scope: {type: "string"},
      },
    },
  },
}

module.exports = {
  config: Config,

  activate() {
    const userKeymapPath = atom.keymaps.getUserKeymapPath()
    this.subscriptions = new CompositeDisposable(
      atom.config.observe("keystroke.commands", commandSpecs => this.registerCommands(commandSpecs)),
      atom.config.observe("keystroke.autoLoadCommandsFromUserKeymap", enabled => {
        if (this.userKeymapObserver) this.userKeymapObserver.dispose()
        if (enabled) this.userKeymapObserver = this.observeUserKeymaps()
      }),
      atom.keymaps.onDidLoadUserKeymap(() => this.onKeymapLoaded()),
      atom.keymaps.onDidReloadKeymap(({path}) => {
        if (path === userKeymapPath) {
          this.onKeymapLoaded()
        }
      })
    )
  },

  deactivate() {
    if (this.userKeymapObserver) this.userKeymapObserver.dispose()
    if (this.commandsDisposable) this.commandsDisposable.dispose()
    if (this.autoCommandsDisposable) this.autoCommandsDisposable.dispose()
    this.subscriptions.dispose()
  },

  observeUserKeymaps() {
    return new CompositeDisposable(
      atom.keymaps.onDidLoadUserKeymap(() => this.onKeymapLoaded()),
      atom.keymaps.onDidReloadKeymap(({path}) => {
        if (path === userKeymapPath) this.onKeymapLoaded()
      })
    )
  },

  onConfigChange(commandSpecs) {
    if (this.commandsDisposable) this.commandsDisposable.dispose()
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
      .filter(keyBinding => keyBinding.source === filePath && keyBinding.command.startsWith("keystroke:auto:"))
      .map(({command, selector: scope}) => {
        const keystroke = command.replace(/^keystroke:auto:/, "")
        return {name: "auto:" + keystroke, keystroke, scope}
      })
  },

  registerCommands(commandSpecs) {
    const commandsByScope = {}
    for (const {name, keystroke, scope = "atom-workspace"} of commandSpecs) {
      if (!commandsByScope[scope]) {
        commandsByScope[scope] = {}
      }
      commandsByScope[scope][`keystroke:${name}`] = () => dispatchKeystroke(keystroke)
    }

    return new CompositeDisposable(
      ...Object.keys(commandsByScope).map(scope => atom.commands.add(scope, commandsByScope[scope]))
    )
  },
}
