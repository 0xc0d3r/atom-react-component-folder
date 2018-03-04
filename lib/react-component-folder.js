'use babel'

import { CompositeDisposable, Disposable } from 'atom'

const path = require('path')
const os = require('os')
const fs = require('fs')

import ReactComponentFolderView from './react-component-folder-view'
import Dialog from './dialog'

const ERROR_MESSAGES = {
  fileAlreadyExists: 'File already exists',
  folderAlreadyExists: 'Component already exists'
}

const PATH_SEPARATOR = path.sep
const COMPONENT_NAME_IDENTIFIER = '$1'
const AUTHOR_IDENTIFIER = '$2'

const folderInputPrompt = 'Enter component name'

export default {
  reactComponentFolderView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.reactComponentFolderView = new ReactComponentFolderView(
      state.reactComponentFolderViewState
    )
    this.dialogView = new Dialog(
      folderInputPrompt,
      'icon-file-add',
      this.onComponentNameConfirm.bind(this),
      this.onComponentNameCancel.bind(this)
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
        'react-component-folder:file-component': () => this.createIndexFile(),
        'react-component-folder:file-style-js': () => this.createJSStyleFile(),
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

  onComponentNameConfirm(componentName) {
    console.log('Component Name is', componentName, this)
    const targetDir = this.getSelectedPath()
    const newComponentDir = path.join(targetDir, componentName)
    this.createAFolder(newComponentDir)
    if (atom.config.get('react-component-folder.index.js')) {
      this.createIndexFile(newComponentDir)
    }
    if (atom.config.get('react-component-folder.styles.js')) {
      this.createJSStyleFile(newComponentDir)
    }
    if (atom.config.get('react-component-folder.styledComponents.js')) {
      this.createStyledComponentFile(newComponentDir)
    }
    if (atom.config.get('react-component-folder.story.js')) {
      this.createStoryFile(newComponentDir)
    }
    if (atom.config.get('react-component-folder.test.js')) {
      this.createTestFile(newComponentDir)
    }
  },

  onComponentNameCancel() {
    console.log('Cancelled!')
  },

  // toggle() {
  //   console.log(
  //     'ReactComponentFolder was toggled!',
  //     document.querySelector('.tree-view .selected').getAttribute('data-path'),
  //     atom.workspace.getActivePaneItem()
  //   )
  //
  //   const pane = atom.workspace.getActivePaneItem()
  //   return this.modalPanel.isVisible()
  //     ? this.modalPanel.hide()
  //     : this.modalPanel.show()
  // },

  createIndexFile(newFileDirectory = this.getSelectedPath()) {
    const newFileName = 'index.js'
    const newFilePath = path.join(newFileDirectory, newFileName)
    const componentName = this.getComponentName(newFileDirectory)
    const fileContents = atom.config.get(
      'react-component-folder.index.jsTemplate'
    )
    const author = this.getAuthor()
    let updatedFileContents = this.replaceAll(
      fileContents,
      COMPONENT_NAME_IDENTIFIER,
      componentName
    )
    updatedFileContents = this.replaceAll(
      updatedFileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    this.createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createJSStyleFile(newFileDirectory = this.getSelectedPath()) {
    const newFileName = 'styles.js'
    const newFilePath = path.join(newFileDirectory, newFileName)
    const fileContents = atom.config.get(
      'react-component-folder.styles.jsTemplate'
    )
    const author = this.getAuthor()
    const updatedFileContents = this.replaceAll(
      fileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    this.createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createStyleFile() {},

  createStyledComponentFile(newFileDirectory = this.getSelectedPath()) {
    const newFileName = 'styledComponents.js'
    const newFilePath = path.join(newFileDirectory, newFileName)
    const fileContents = atom.config.get(
      'react-component-folder.styledComponents.jsTemplate'
    )
    const author = this.getAuthor()
    const updatedFileContents = this.replaceAll(
      fileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    this.createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createStoryFile(newFileDirectory = this.getSelectedPath()) {
    const componentName = this.getComponentName(newFileDirectory)
    const newFileName = `${componentName || 'index'}.story.js`
    const newFilePath = path.join(newFileDirectory, newFileName)
    const fileContents = atom.config.get(
      'react-component-folder.story.jsTemplate'
    )
    const author = this.getAuthor()
    let updatedFileContents = this.replaceAll(
      fileContents,
      COMPONENT_NAME_IDENTIFIER,
      componentName
    )
    updatedFileContents = this.replaceAll(
      updatedFileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    this.createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createTestFile(newFileDirectory = this.getSelectedPath()) {
    const componentName = this.getComponentName(newFileDirectory)
    const newFileName = `${componentName || 'index'}.test.js`
    const newFilePath = path.join(newFileDirectory, newFileName)
    const fileContents = atom.config.get(
      'react-component-folder.test.jsTemplate'
    )
    const author = this.getAuthor()
    const updatedFileContents = this.replaceAll(
      fileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    this.createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createComponentFolder() {
    this.dialogView.attach()
  },

  // Utils

  createFileWithTemplate(filePath, fileContent) {
    if (this.isFileExists(filePath)) {
      atom.notifications.addError(ERROR_MESSAGES.fileAlreadyExists)
      return
    }
    fs.writeFile(filePath, fileContent, err => {
      if (err) throw err
    })
  },

  createAFolder(folderPath) {
    if (this.isFileExists(folderPath)) {
      atom.notifications.addError(ERROR_MESSAGES.folderAlreadyExists)
      return
    }
    fs.mkdirSync(folderPath)
  },

  getComponentName(path) {
    const splittedPath = path.split(PATH_SEPARATOR)
    if (path.endsWith(PATH_SEPARATOR)) {
      return splittedPath[splittedPath.length - 2] || 'Index'
    }
    return path.split(PATH_SEPARATOR).pop() || 'Index'
  },

  replaceAll(source, search, replacement) {
    return source.split(search).join(replacement)
  },

  getOSUsername() {
    return os.userInfo().username
  },

  getAuthor() {
    const defaultAuthor = atom.config.get('react-component-folder.author')
    if (!defaultAuthor) {
      return this.getOSUsername()
    }
    return defaultAuthor
  },

  getSelectedPath() {
    return document
      .querySelector('.tree-view .selected')
      .getAttribute('data-path')
  },

  isFileExists(file) {
    return fs.existsSync(file)
  }
}
