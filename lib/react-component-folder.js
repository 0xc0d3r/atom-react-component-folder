'use babel'

import { CompositeDisposable, Disposable } from 'atom'

import Dialog from './dialog'

import {
  ERROR_MESSAGES,
  COMPONENT_NAME_IDENTIFIER,
  AUTHOR_IDENTIFIER,
  folderInputPrompt
} from '../constants/index'

import {
  createFileWithTemplate,
  createAFolder,
  getAuthor,
  getSelectedPath,
  getComponentName,
  replaceAll
} from '../utils/index'

export default {
  activate(state) {
    this.dialogView = new Dialog(
      folderInputPrompt,
      'icon-file-add',
      this.onComponentNameConfirm.bind(this),
      this.onComponentNameCancel.bind(this)
    )

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
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
    this.disposables.dispose()
  },

  serialize() {
    return {}
  },

  onComponentNameConfirm(componentName) {
    const targetDir = getSelectedPath()
    const newComponentDir = path.join(targetDir, componentName)
    createAFolder(newComponentDir)
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
    // console.log('Cancelled!')
  },

  createIndexFile(newFileDirectory = getSelectedPath()) {
    const newFileName = 'index.js'
    const newFilePath = path.join(newFileDirectory, newFileName)
    const componentName = getComponentName(newFileDirectory)
    const fileContents = atom.config.get(
      'react-component-folder.index.jsTemplate'
    )
    const author = getAuthor()
    let updatedFileContents = replaceAll(
      fileContents,
      COMPONENT_NAME_IDENTIFIER,
      componentName
    )
    updatedFileContents = replaceAll(
      updatedFileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createJSStyleFile(newFileDirectory = getSelectedPath()) {
    const newFileName = 'styles.js'
    const newFilePath = path.join(newFileDirectory, newFileName)
    const fileContents = atom.config.get(
      'react-component-folder.styles.jsTemplate'
    )
    const author = getAuthor()
    const updatedFileContents = replaceAll(
      fileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createStyleFile() {},

  createStyledComponentFile(newFileDirectory = getSelectedPath()) {
    const newFileName = 'styledComponents.js'
    const newFilePath = path.join(newFileDirectory, newFileName)
    const fileContents = atom.config.get(
      'react-component-folder.styledComponents.jsTemplate'
    )
    const author = getAuthor()
    const updatedFileContents = replaceAll(
      fileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createStoryFile(newFileDirectory = getSelectedPath()) {
    const componentName = getComponentName(newFileDirectory)
    const newFileName = `${componentName || 'index'}.story.js`
    const newFilePath = path.join(newFileDirectory, newFileName)
    const fileContents = atom.config.get(
      'react-component-folder.story.jsTemplate'
    )
    const author = getAuthor()
    let updatedFileContents = replaceAll(
      fileContents,
      COMPONENT_NAME_IDENTIFIER,
      componentName
    )
    updatedFileContents = replaceAll(
      updatedFileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createTestFile(newFileDirectory = getSelectedPath()) {
    const componentName = getComponentName(newFileDirectory)
    const newFileName = `${componentName || 'index'}.test.js`
    const newFilePath = path.join(newFileDirectory, newFileName)
    const fileContents = atom.config.get(
      'react-component-folder.test.jsTemplate'
    )
    const author = getAuthor()
    const updatedFileContents = replaceAll(
      fileContents,
      AUTHOR_IDENTIFIER,
      author
    )
    createFileWithTemplate(newFilePath, updatedFileContents)
  },

  createComponentFolder() {
    this.dialogView.attach()
  }
}
