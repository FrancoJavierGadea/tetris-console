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

To play audio, the default options are:

- `powershell` on **Windows**
  
- `aplay` on **Linux**
  
    > Since `aplay` does not allow changing the volume, the `--volume` flag does not work

- `afplay` on **Mac**

    > Since I don't own a `Mac`, I haven't been able to test if it works properly

<br>

### VLC

The VLC player is available on all platforms and is an ideal option if the others do not work for you.

Install the player if you don't have it.

Check if you can run it from a terminal:

```sh
vlc --version
```

> If the command is not recognized, add the path where it is installed to the PATH variable.
> 
> It is usually: C:\Program Files\VideoLAN\VLC

Now, simply run it with:

```sh
tetris-console --player "vlc" --volume 0.5
```

```js
const tetris = new TetrisConsole({
    player: 'vlc',
    volume: 0.5
});

tetris.init();
```

<br>

**Best piano Tetris cover** here: [Tetris Theme (Korobeiniki) - Sonya Belousova](https://www.youtube.com/watch?v=q8rcTvAoRzk)