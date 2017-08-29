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

function keydown(keystroke, target) {
  const event = buildKeydownEventFromKeystroke(keystroke, target)
  atom.keymaps.handleKeyboardEvent(event)
}

function dispatchKeystroke(keystrokes) {
  const editor = atom.workspace.getActiveTextEditor()
  // Without this DUMMY keystroke, first char in keystroke will fail to match.
  // because when first keyboardEvent was fired, invoking key is still not
  // released(keyup) and key lookup is done with invoking key combination.
  keydown("DUMMY", null)

  editor.transact(() => {
    for (const keystroke of normalizeKeystrokes(keystrokes).split(/\s+/)) {
      keydown(keystroke, document.activeElement)
    }
  })
}

module.exports = {
  dispatchKeystroke,
}
