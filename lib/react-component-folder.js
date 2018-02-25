'use babel'

import ReactComponentFolderView from './react-component-folder-view'
import { CompositeDisposable, Disposable } from 'atom'

export default {
  reactComponentFolderView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.reactComponentFolderView = new ReactComponentFolderView(
      state.reactComponentFolderViewState
    )
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.reactComponentFolderView.getElement(),
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add('atom-workspace', {
        'react-component-folder:toggle': () => this.toggle(),
        'react-component-folder:file-component': () => this.createIndexFile(),
        'react-component-folder:file-style': () => this.createJSStyleFile(),
        'react-component-folder:file-styled-component': () =>
          this.createStyledComponentFile(),
        'react-component-folder:file-story': () => this.createStoryFile(),
        'react-component-folder:file-test': () => this.createTestFile(),
        'react-component-folder:folder-component': () =>
          this.createComponentFolder()
      })
    )
  },

  deactivate() {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.reactComponentFolderView.destroy()
  },

  serialize() {
    return {
      reactComponentFolderViewState: this.reactComponentFolderView.serialize()
    }
  },

  toggle() {
    console.log(
      'ReactComponentFolder was toggled!',
      document.querySelector('.tree-view .selected').getAttribute('data-path'),
      atom.workspace.getActivePaneItem()
    )
    const pane = atom.workspace.getActivePaneItem()
    return this.modalPanel.isVisible()
      ? this.modalPanel.hide()
      : this.modalPanel.show()
  },

  createIndexFile() {
    const editor = atom.workspace.getActivePaneItem()
    console.log('path', editor, editor.buffer.file.path)
  },

  createJSStyleFile() {},

  createStyleFile() {},

  createStyledComponentFile() {},

  createStoryFile() {},

  createTestFile() {},

  createComponentFolder() {}
}
