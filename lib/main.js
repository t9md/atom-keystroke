const {CompositeDisposable} = require("atom")
const {dispatchKeystroke} = require("./utils")

const Config = {
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
    this.subscriptions = new CompositeDisposable(
      atom.config.observe("keystroke.commands", commandSpecs => this.updateCommands(commandSpecs))
    )
  },

  deactivate() {
    if (this.commandsDisposable) this.commandsDisposable.dispose()
    this.subscriptions.dispose()
  },

  updateCommands(commandSpecs) {
    if (this.commandsDisposable) this.commandsDisposable.dispose()

    const scopeByCommands = {}
    for (const {name, keystroke, scope = "atom-workspace"} of commandSpecs) {
      if (!scopeByCommands[scope]) {
        scopeByCommands[scope] = {}
      }
      scopeByCommands[scope][`keystroke:${name}`] = () => dispatchKeystroke(keystroke)
    }

    this.commandsDisposable = new CompositeDisposable(
      ...Object.keys(scopeByCommands).map(scope => atom.commands.add(scope, scopeByCommands[scope]))
    )
  },
}
