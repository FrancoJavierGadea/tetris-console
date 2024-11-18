import { TetrisConsole } from "./tetris/tetris-console.js";
import path from "node:path";


//MARK: Test tetris
const tetris = new TetrisConsole();

tetris.init();


// const source = './assets/tetrio-best-theme.mp3';


// console.log(path.isAbsolute(source));

// console.log(path.join(import.meta.dirname, './', source));