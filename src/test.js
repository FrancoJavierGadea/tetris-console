import { TetrisConsole } from "./tetris/tetris-console.js";
import path from "node:path";
import { ServerLogger } from "./utils/Server-logger.js";



//MARK: Test tetris
const tetris = new TetrisConsole();

//Showlogs: curl -N -H "Accept: text/event-stream" http://localhost:3300/logs
const logger = new ServerLogger();

tetris.on('start', () => {

    logger.log('Tetris game start');
});

tetris.on('keydown', (e) => {

    logger.log('Keydown: ', {...e.detail});
});

tetris.on('end', () => {

    logger.log('Tetris game end');
    logger.end();
});

//MARK: Tetris game events
tetris.tetris.on('move-piece', (e) => {

    logger.log('> Move piece', {...e.detail});
});

tetris.tetris.on('spawn-piece', (e) => {

    logger.log('> Spawn piece', {...e.detail});
});

tetris.tetris.on('clear-rows', (e) => {

    logger.log('> Clear rows', {...e.detail});
});

tetris.tetris.on('rotate-piece', (e) => {

    logger.log('> Rotate piece', {...e.detail});
});

tetris.tetris.on('reset-board', (e) => {

    logger.log('> Reset board', {...e.detail});
});

setTimeout(() => {

    tetris.init();

}, 3000);