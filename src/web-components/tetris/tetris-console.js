import { exec, spawnSync } from "node:child_process";
import path from "node:path";
import { Tetris } from "./tetris.js";


const KEYS = {
    ArrowDown: '\u001b[B',
    ArrowUp: '\u001b[A',
    ArrowLeft: '\u001b[D',
    ArrowRight: '\u001b[C',
    Space: ' '
}

const PIECE_COLORS = {
    'T': (text) => `\x1b[35m${text}\x1b[0m`,
    'L': (text) => `\x1b[37m${text}\x1b[0m`,
    'J': (text) => `\x1b[34m${text}\x1b[0m`,
    'I': (text) => `\x1b[36m${text}\x1b[0m`,
    'S': (text) => `\x1b[32m${text}\x1b[0m`,
    'Z': (text) => `\x1b[31m${text}\x1b[0m`,
    'O': (text) => `\x1b[33m${text}\x1b[0m`
};

export class TetrisConsole {


    constructor(params = {}){

        const {
            rows = 20,
            columns = 10
        } = params;

        this.rows = rows;
        this.columns = columns;

        this.tetris = new Tetris({rows, columns});
        
    }

    //MARK: Init
    init(){
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        //MARK: Events
        process.stdin.on('data', (key) => {

            // Si presionas Ctrl+C, se sale del programa
            if (key === '\u0003') { 

                this.stopMusic();
                process.exit();
            }

            switch (key) {

                case KEYS.ArrowUp:
                    this.tetris.rotatePiece();
                    break;

                case KEYS.ArrowDown:
                    this.tetris.movePiece({rows: 1});
                    break;

                case KEYS.ArrowRight:
                    this.tetris.movePiece({columns: 1});
                    break;

                case KEYS.ArrowLeft:
                    this.tetris.movePiece({columns: -1});
                    break;

                case KEYS.Space:
                    this.tetris.movePieceToDown();
                    break;
            }

            this.draw();

            return;
        });

        this.playMusic();

        this.tetris.spawnPiece();
        this.draw();
        this.play();
    }

    //MARK: Draw
    draw(){

        let result = '';

        for (let i = 0; i < this.rows; i++) {
            
            let row = '<!';

            for (let j = 0; j < this.columns; j++) {

                const letter = this.tetris.board[i][j];
                
                if(letter !== 0){
                    
                    row += PIECE_COLORS[letter]('[]');
                }
                else {
                    
                    row += '--';
                }
            }
            
            row += '!>';
            
            result += `${row}\n`;
        }
        
        result += `<!${'=='.repeat(this.columns)}!>\n`;
        

        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        process.stdout.write(result, 'utf8');

        return;
    }

    
    //MARK: Play music
    #musicProcess = null;

    playMusic(){

        const themePath = path.join(import.meta.dirname, '../../assets/tetris.wav');

        const ps = `powershell -c while($true){(New-Object Media.SoundPlayer "${themePath}").PlaySync();}`;

        this.#musicProcess = exec(ps, (err, out) => {

            //console.log(err, out);
        });
    }

    //MARK: Stop music
    stopMusic(){

        if(this.#musicProcess){

            spawnSync("taskkill", ["/pid", this.#musicProcess.pid, '/f', '/t']);
        }
    }


    //MARK: Play Game loop
    #intervalID = null;

    play(){

        this.#intervalID = setInterval(() => {

            this.tetris.movePiece({rows: 1});
            this.draw();

            return;

        }, 1000);
    }

    //MARK: Stop Game loop
    stop(){

        if(this.#intervalID){

            clearInterval(this.#intervalID)
        }
    }
}

const tetris = new TetrisConsole();

tetris.init();