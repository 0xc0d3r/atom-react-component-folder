'use babel'

import { CompositeDisposable, Disposable, Emitter, TextEditor } from 'atom'

export default class Dialog {
  constructor(prompt, iconClass, onConfirm = () => {}, onCancel = () => {}) {
    this.emitter = new Emitter()
    this.disposables = new CompositeDisposable()

    this.element = document.createElement('div')
    this.element.classList.add('react-component-folder')

    this.promptText = document.createElement('label')
    this.promptText.classList.add('icon')
    if (iconClass) {
      this.promptText.classList.add(iconClass)
    }
    this.promptText.textContent = prompt

    this.element.appendChild(this.promptText)

    this.miniEditor = new TextEditor({ mini: true })
    this.miniEditor.element.addEventListener('blur', this.handleBlur)
    this.disposables.add(
      new Disposable(
        this.miniEditor.element.removeEventListener('blur', this.handleBlur)
      )
    )

    this.element.appendChild(this.miniEditor.element)

    atom.commands.add(this.element, {
      'core:confirm': () => {
        if (onConfirm) {
          onConfirm(this.miniEditor.getText())
          this.close()
        }
      },
      'core:cancel': () => {
        if (onCancel) {
          onCancel()
        }
        this.cancel()
      }
    })
  }

  attach() {
    this.panel = atom.workspace.addModalPanel({
      item: this
    })
    this.miniEditor.element.focus()
  }

  handleBlur() {
    if (document.hasFocus()) {
      this.close()
    }
  }

  close() {
    const panel = this.panel
    this.panel = null
    if (panel) {
      panel.destroy()
    }
    this.emitter.dispose()
    this.disposables.dispose()
    this.miniEditor.setText('')
    this.miniEditor.destroy()
    const activePane = atom.workspace.getCenter().getActivePane()
    if (activePane.isDestroyed()) {
      activePane.activate()
    }
  }

  cancel() {
    this.close()
    const treeView = document.querySelector('.tree-view')
    if (treeView) treeView.focus()
  }
}
