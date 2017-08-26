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
    @subscriptions.add atom.config.observe 'keystroke.commands', @updateCommands.bind(this)

  deactivate: ->
    @commandsDisposable?.dispose()
    @subscriptions.dispose()

    {@subscriptions, @commandsDisposable} = {}

  updateCommands: (newCommands) ->
    @commandsDisposable?.dispose()
    @commandsDisposable = new CompositeDisposable
    @defineCommands(newCommands)

  defineCommands: (newCommands) ->
    scopeByCommands = {}

    for command in newCommands
      do (command) ->
        {name, keystroke, scope} = command
        scope ?= 'atom-workspace'
        commandName = "keystroke:#{name}"
        scopeByCommands[scope] ?= {}
        scopeByCommands[scope][commandName] = -> dispatchKeystroke(keystroke)

    for scope, commands of scopeByCommands
      @commandsDisposable.add(atom.commands.add(scope, commands))
