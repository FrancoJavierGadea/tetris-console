import { TetrisConsole } from "./tetris/tetris-console.js";
import { test as testSoundWithAplay } from "./utils/PlaySound/linux/PlayWithAplay.js";
import { test as testSoundWithPS } from "./utils/PlaySound/powershell/PlayWithPowershell.js";

//MARK: Test tetris
const tetris = new TetrisConsole();

tetris.init();




//MARK: Test Sound
// testSoundWithPS();

// testSoundWithAplay(); 