# Tetris Console Game

Welcome to Tetris Console Game! Play the classic Tetris directly in your terminal.

<br>

## Global Installation

To install the game globally on your system, run:

```sh
npm install --global https://github.com/FrancoJavierGadea/tetris-console.git
```
```sh
npm i -g https://github.com/FrancoJavierGadea/tetris-console.git
```

### Run the Game

Once installed, start the game with:

```sh
tetris-console
```

<br>

> If you want to uninstall the game:
> 
> ```sh
> npm uninstall tetris-console
> ```

<br>

## Install in a project

```sh
npm install --save-dev https://github.com/FrancoJavierGadea/tetris-console.git
```
```sh
npm i -D https://github.com/FrancoJavierGadea/tetris-console.git
```

### Run in a Project

You can run the game within your project using `npx`:

```sh
npx tetris-console
```


#### Add a Script to package.json

To make running the game easier, add a script to your package.json:

```json
{
    "scripts": {
        "play-tetris": "tetris-console"
    },
}
```
Then, run the script with:
```sh
npm run play-tetris
```


<br>

#### Use in a JavaScript File

If you want to integrate it into your own JavaScript code:

```js
import TetrisConsole from "tetris-console";

const tetris = new TetrisConsole();

tetris.init();
```

<br>

> To remove the game from your project:
> 
> ```sh
> npm uninstall tetris-console
> ```

<br>

## Music

**Best piano Tetris cover** here: [Tetris Theme (Korobeiniki) - Sonya Belousova](https://www.youtube.com/watch?v=q8rcTvAoRzk)