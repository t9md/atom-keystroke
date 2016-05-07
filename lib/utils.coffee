{normalizeKeystrokes} = require(atom.config.resourcePath + "/node_modules/atom-keymap/lib/helpers")

KeymapManager = null
Modifiers = ['ctrl', 'alt', 'shift', 'cmd']

buildKeydownEvent = (key, options) ->
  KeymapManager ?= atom.keymaps.constructor
  KeymapManager.buildKeydownEvent(key, options)

buildKeydownEventFromKeystroke = (keystroke, target) ->
  parts = keystroke.split('-')
  options = {target}

  key = null
  for part in parts
    if part in Modifiers
      options[part] = true
    else
      key = part
  return buildKeydownEvent(key, options)

keydown = (keystroke, target) ->
  event = buildKeydownEventFromKeystroke(keystroke, target)
  atom.keymaps.handleKeyboardEvent(event)

dispatchKeystroke = (keystrokes) ->
  # Without this DUMMY keystroke, first char in keystroke will fail to match.
  # because when first keyboardEvent was fired, invoking key is still not
  # released(keyup) and key lookup is done with invoking key combination.
  keydown('DUMMY', document.activeElement)
  keystrokes = normalizeKeystrokes(keystrokes)
  for keystroke in keystrokes.split(/\s+/)
    keydown(keystroke, document.activeElement)

module.exports = {
  dispatchKeystroke
}
