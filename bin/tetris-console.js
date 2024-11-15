#!/usr/bin/env node

import TetrisConsole from "../src/index.js";
import { getConfig } from "./config.js";
import { getHelp, getVersion } from "./utils.js";


const config = getConfig();

console.log(config);

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
    source: config['--source']
});

tetris.init();


