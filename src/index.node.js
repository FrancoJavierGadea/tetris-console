import { getTheme, CLASSIC, HEARTS, MODERN } from "./tetris/tetris-console-themes.js";
import { TetrisConsole } from "./tetris/tetris-console.js";
import { COLLISIONS, SPAWN_MODES } from "./tetris/tetris-constants.js";
import { PIECES, rotatePiece, getRandomPiece, getPieceByName } from "./tetris/tetris-pieces.js";
import { Tetris } from "./tetris/tetris.js";


export { 
    TetrisConsole, Tetris, 
    COLLISIONS, SPAWN_MODES,
    PIECES, rotatePiece, getPieceByName, getRandomPiece,
    getTheme, CLASSIC, HEARTS, MODERN
};

export default TetrisConsole;
