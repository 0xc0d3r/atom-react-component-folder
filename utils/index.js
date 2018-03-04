'use babel'

const path = require('path')
const os = require('os')
const fs = require('fs')

export const PATH_SEPARATOR = path.sep
import { ERROR_MESSAGES } from '../constants/index'

export function createFileWithTemplate(filePath, fileContent) {
  if (isFileExists(filePath)) {
    atom.notifications.addError(ERROR_MESSAGES.fileAlreadyExists)
    return
  }
  fs.writeFile(filePath, fileContent, err => {
    if (err) throw err
  })
}

export function createAFolder(folderPath) {
  if (isFileExists(folderPath)) {
    atom.notifications.addError(ERROR_MESSAGES.folderAlreadyExists)
    return
  }
  fs.mkdirSync(folderPath)
}

export function getComponentName(path) {
  const splittedPath = path.split(PATH_SEPARATOR)
  if (path.endsWith(PATH_SEPARATOR)) {
    return splittedPath[splittedPath.length - 2] || 'Index'
  }
  return path.split(PATH_SEPARATOR).pop() || 'Index'
}

export function replaceAll(source, search, replacement) {
  return source.split(search).join(replacement)
}

export function getOSUsername() {
  return os.userInfo().username
}

export function getAuthor() {
  const defaultAuthor = atom.config.get('react-component-folder.author')
  if (!defaultAuthor) {
    return getOSUsername()
  }
  return defaultAuthor
}

export function getSelectedPath() {
  return document
    .querySelector('.tree-view .selected')
    .getAttribute('data-path')
}

export function isFileExists(file) {
  return fs.existsSync(file)
}
