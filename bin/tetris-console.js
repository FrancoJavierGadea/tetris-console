#!/usr/bin/env node

import TetrisConsole from "../src/index.js";
import { getTheme } from "../src/tetris/tetris-console-themes.js";
import { getConfig } from "./config.js";
import { getHelp, getVersion } from "./utils.js";


const config = getConfig();

switch (true) {

    case config['--version']:

        console.log(getVersion());
        process.exit();

    case config['--help']:
        
        console.log(getHelp());
        process.exit();
}


//MARK: Run the game
const tetris = new TetrisConsole({
    volume: config['--volume'],
    player: config['--player'],
    rows: config['--rows'],
    columns: config['--columns'],
    source: config['--source'],
    theme: getTheme(config['--theme'])
});

tetris.init();


