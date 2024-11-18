# Tetris Console Game

Welcome to Tetris Console Game! Play the classic Tetris directly in your terminal.

## Global Installation

To install the game globally on your system, run:

```sh
npm install --global https://github.com/FrancoJavierGadea/tetris-console.git
```
```sh
npm i -g https://github.com/FrancoJavierGadea/tetris-console.git
```

#### Try with `npx`

```sh
npx https://github.com/FrancoJavierGadea/tetris-console.git tetris-console
```

### Run the Game

Once installed, start the game with:

```sh
tetris-console
```

> If you want to uninstall the game:
> 
> ```sh
> npm uninstall tetris-console
> ```

<br>

## Controls

- `Arrow Left`: Move the piece left.
- `Arrow Right`: Move the piece right.
- `Arrow Down`: Move the piece down faster.
- `Arrow Up`: Rotate the piece.
- `C`: Save the current piece to hold.
- `Space`: Drop the piece instantly to the bottom.
- `Ctrl + C`: Quit the game.

## Command-Line Options

- `--version`, `-v`

- `--help`, `-h`

- `--theme <style>`, `-t <style>` 
  
    Change the Tetris game theme. Available options are: `"classic"` `"modern"` `"hearts"`

    **Default**: `"classic"`

- `--columns <int number>`, `-c <int number>` 
  
    Set the number of columns for the Tetris board
  
    **Default**: `10`

- `--rows <int number>`, `-r <int number>` 
  
    Set the number of rows for the Tetris board

    **Default**: `20`

- `--player <program>`, `-p <program>` 
  
    Specify the program to play the game music. Options include: `"vlc"` `"powershell"` `"aplay"` `"afplay"`

- `--volume <number>`, `-V <number>` 
  
    Set the volume level for the game music. Accepts a value between 0.0 (mute) and 1.0 (full volume). 

    > **Note**: The `--volume` option is not supported by `aplay` on Linux.

    **Default**: `0.5`

- `--source <path>`, `-s <path>` 
  
  Use a custom song by specifying the path to an audio file. You can also use predefined values like `#tetris`, `#tetris-classic`, or `#tetrio-best-theme` for songs included in the `assets` folder.

  > **Note**: `.mp3` files work with all players except `aplay`, which only supports `.wav` files.

  **Default**: `"#tetris"`

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
import { CLASSIC } from "./tetris-console-themes.js";

const tetris = new TetrisConsole({
    rows: 20,
    columns: 10,
    theme: CLASSIC,
    volume: 0.5,
    player: 'vlc',
    source: path.join(import.meta.dirname, '../assets/tetris.wav'),
});

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

### Songs

- `source = "#tetris"`

    **The Best piano Tetris cover**: [Tetris Theme (Korobeiniki) - Sonya Belousova](https://www.youtube.com/watch?v=q8rcTvAoRzk)

- `source = "#tetrio-best-theme"`

    The **best theme from [Tetr.io](https://tetr.io/)**: [Ultra Super Heroes, Kamoking - Battle BGM](https://www.youtube.com/watch?v=hhQcoxDMMs0)

- `source = "#tetris-classic"`

    **Classic tetris theme**: [Original Tetris theme (Tetris Soundtrack)](https://www.youtube.com/watch?v=NmCCQxVBfyM)