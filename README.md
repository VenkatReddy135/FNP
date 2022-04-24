# Zeus

> "Zeus is the god of the sky, lightning and the thunder in Ancient Greek, and he is also the ruler of all the gods on Mount Olympus"

At FNP, Zeus is the ruler of all back office applications.

## Getting started

This is a tl;dr version.

- Requirements
  - node LTS or >> 10
  - Ability to use a terminal or command prompt
- Clone this repository
- Create `config.js` file, here is the [example](#configjs-example-file) file
- In case you want a custom hostname and port you can use `.env` file. You will have to set up `HOST` and `PORT` variables in `.env` If you have set up `HOST` variable in your `.env` file, you will have to set up your `/etc/hosts` file as well. Depending upon your operating system, you will need `sudo` or `admin` rights to do this.
- Run `npm i`
- Run `npm start`
- You are all set

## Zeus is based on React Admin

And React Admin uses [create-react-app](https://create-react-app.dev/) to bootstrap the project and [Material UI](https://material-ui.com/) for UI components. Your feedback and contributions for any other tool is welcome!
Here are some points to note:

- When developing anything follow principle of colocation.
  > Things that change together should be located as close as reasonable.
- Components are in `/src/components` folder.
- All global layout or related files go in `/src/layout` folder.
- All pages related files go in `/src/pages` folder. For example anything related to category goes to `/src/pages/category`.
- Routes must go in `/src/routes.js` file. In case routes file grows and becomes unmanageable create a `/src/routes` folder and break routes file.
- React Admin has support for [i18n](https://marmelab.com/react-admin/Translation.html) and [polyglot.js](https://airbnb.io/polyglot.js/) which we will use. Example Hindi and English translation folders have been added. All static labels must go in translation files.

## Code guidelines

This JavaScript project uses AirBNB javascript guidelines. We use Eslint & Husky to enforce guidelines. Husky also enforces unit test case validation. You will not be able to commit code until all test cases pass.

## Documentation

Follow [JSDoc](https://jsdoc.app/). Code reviewers have responsibility to ensure they demand documentation. Run `npm run docs` to generate documentation.

## Editor & Plugins (Editor Extensions)

We use [EditorConfig](https://editorconfig.org/). A `.editorconfig` file has been added at root. Recommended editor is VSCode.

### VS Code

We prefer to use VSCode as our source code editor. Get VS Code [here](https://code.visualstudio.com/download). In case you are using some other editor, please ensure you stick to coding guidelines.

Below is a list recommended **must install** plugins/extensions for VS Code.

### VS Code Extensions

- [**EditorConfig for VS Code**](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [**Prettier - Code Formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [**vscode-flow-ide**](https://marketplace.visualstudio.com/items?itemName=gcazaciuc.vscode-flow-ide)
- [**npm Intellisense**](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
- [**SonarLint**](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
- [**Import Cost**](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [**GitLens**](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [**Debugger for Chrome**](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [**Code Spell Checker**](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [**change-case**](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case)

### VS Code auto format on save

Here is an example of `settings.json` which will auto format when save your code. Example settings JSON has other suggested settings enabled as well.

```
{
    "workbench.startupEditor": "newUntitledFile",
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    },
    "files.autoSave": "afterDelay",
    "editor.wordWrap": "on",
    "html.format.endWithNewline": true,
    "html.format.indentInnerHtml": true,
    "editor.formatOnSave": true,
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true,
    },
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "eslint.alwaysShowStatus": true,
    "eslint.codeAction.showDocumentation": {
        "enable": true
    }
}
```

## .env example file

You need to create a .env file in your project directory. This project follows [create-react-app](https://create-react-app.dev/) way of having .env files. [Read more here](https://create-react-app.dev/docs/adding-custom-environment-variables#adding-development-environment-variables-in-env)

```
# Set this true for https
HTTPS=true
# Set this to your favorite hostname, this is totally optional.
HOST=chetan-zeus.fnp.com

```

## config.js example file

You need to create a config.js file inside a config folder in public directory .

```
# Host name for API gateway
window.REACT_APP_API_HOST = "http://172.27.133.22:8084";

```
