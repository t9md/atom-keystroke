const {normalizeKeystrokes} = require(atom.config.resourcePath + "/node_modules/atom-keymap/lib/helpers")

let KeymapManager
const Modifiers = ["ctrl", "alt", "shift", "cmd"]

function buildKeydownEventFromKeystroke(keystroke, target) {
  const parts = keystroke.split("-")
  const options = {target}

  let key
  for (let part of parts) {
    if (Modifiers.includes(part)) {
      options[part] = true
    } else {
      key = part
    }
  }
  if (!KeymapManager) KeymapManager = atom.keymaps.constructor
  return KeymapManager.buildKeydownEvent(key, options)
}

function dispatchKeystroke(keystrokes) {
  // When first keyboardEvent was fired, invoking(trigger) key is still not
  // released(keyup) and key lookup is done with invoking key combination.
  // We need to reset to start lookup as if simulating keystroke is typed from solely.
  atom.keymaps.clearQueuedKeystrokes()

  const execute = () => {
    for (const key of normalizeKeystrokes(keystrokes).split(/\s+/)) {
      const event = buildKeydownEventFromKeystroke(key, document.activeElement)
      atom.keymaps.handleKeyboardEvent(event)
    }
  }
  const editor = atom.workspace.getActiveTextEditor()
  if (editor) editor.transact(execute)
  else execute()
}

module.exports = {
  dispatchKeystroke,
}
