# VS Code extension

This project in installable as a VS Code extension.

For now it is only available for dev testing but eventually will be installable for anyone using a download file (maybe even using the marketplace).


## Installation

### Install system dependencies

Install Node.js.

### Clone

```sh
$ git clone git@github.com:MichaelCurrin/auto-commit-msg.git
$ cd auto-commit-msg
```

### Install project dependencies

```sh
$ npm install
```


#### Setup

Run `npm install` in terminal to install dependencies.


## Usage
> Start the extension for local development

Open VS Code at the repo.

```sh
$ code .
```

Run the extension.

1. Go to the Debub tab.
1. Click _Run Extension_.


This will start a sandboxes VS Code window which has the extension active in it and no other extensions. At a lower level, it runs `npm compile` and `npm watch`.

The code for the extension is in [src](/src/).



## Tests


### Unit

Unit tests.

```sh
$ npm run test:unit
```

Run the pretest and unit test steps.

```sh
$ npm test
```

### Integration

Run VS Code extention tests. Does not cover pretest by default, so is added here.

NB. VS Code will be downloaded and run against the code. You will get errors unless you close VS Code first.

```sh
$ npm run pretest && npm run test:integration
```
