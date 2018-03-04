# atom-react-component-folder [![Build Status](https://travis-ci.org/0xc0d3r/atom-react-component-folder.svg)](https://travis-ci.org/0xc0d3r/atom-react-component-folder)

An atom plugin to generate a most common react/react-native folder structure and template files

### Installation

Install with `apm install atom-react-component-folder` or use _Install Packages_ from _Atom Settings_.

### Usage

Using the TreeView, Right click on any directory to expose the Create a component folder option. Selecting this option will open a modal that will allow you to enter component name. Pressing Enter Key will create a react/react-native component with template code.

### Component structure

```
  HelloWorld
    - index.js
    - styles.js
    - styledComponents.js
    - HelloWorld.story.js
    - HelloWorld.test.js
```

_Note:_ After working on few projects, we realised the above component structure is flexible and maintainable.

![atom-react-component-folder](https://raw.githubusercontent.com/0xc0d3r/atom-react-component-folder/master/screenshots/demo.gif)

### Contribute

* Please open an [issue](https://github.com/0xc0d3r/atom-react-component-folder/issues) before submitting a PR
* All PR's should be accompanied wth tests :rocket:
