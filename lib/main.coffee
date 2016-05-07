{CompositeDisposable} = require 'atom'
{dispatchKeystroke} = require './utils'

Config =
  commands:
    type: 'array'
    default: []
    items:
      type: 'object'
      properties:
        name: {type: 'string'}
        keystroke: {type: 'string'}
        scope: {type: 'string'}

module.exports =
  config: Config
  commandsDisposable: null

  activate: ->
    @subscriptions = new CompositeDisposable

    @subscribe atom.config.observe 'keystroke.commands', (newValue) =>
      @defineCommands(newValue)

  deactivate: ->
    @commandsDisposable?.dispose()
    @subscriptions.dispose()

    {@subscriptions, @commandsDisposable} = {}

  subscribe: (args...) ->
    @subscriptions.add args...

  defineCommands: (newCommands) ->
    @commandsDisposable?.dispose()
    @commandsDisposable = new CompositeDisposable

    scopeByCommands = {}

    for {name, keystroke, scope} in newCommands
      do (keystroke, scope) ->
        scope ?= 'atom-workspace'
        scopeByCommands[scope] ?= {}
        scopeByCommands[scope]["keystroke:#{name}"] = -> dispatchKeystroke(keystroke)

    for scope, commands of scopeByCommands
      @commandsDisposable.add(atom.commands.add(scope, commands))
