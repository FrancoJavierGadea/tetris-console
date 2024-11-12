import path from "node:path";
import { Tetris } from "./tetris.js";
import { ServerLogger } from "../utils/Server-logger.js";
import { getDefaultPlayerSound, getPlayerSound } from "../utils/PlaySound/PlayerSound.js";


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

    #soundPlayer = null;

    constructor(params = {}){

        const {
            rows = 20,
            columns = 10,
            music = {}
        } = params;

        this.rows = rows;
        this.columns = columns;

        this.music = music;

        this.LOGS = new ServerLogger();

        this.tetris = new Tetris({
            rows, columns, 
            logs: {
                out: (...args) => this.LOGS.log(...args)
            }
        });
        
        //Music
        const source = path.join(import.meta.dirname, '../assets/tetris.wav');
        const volume = this.music.volume;

        this.#soundPlayer = this.music.player ? 
            getPlayerSound(this.music.player, {source, volume})
            :
            getDefaultPlayerSound({source, volume})
        ;
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

                this.#soundPlayer.stop();

                this.LOGS.end();
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


                case 'c':
                case 'C':
                    this.tetris.savePiece();
                    break;
            }

            this.draw();

            return;
        });

        this.#soundPlayer.play();

        this.tetris.spawnPiece();
        this.draw();
        this.play();
    }

    //MARK: Draw
    draw(){

        const piece = this.tetris.currentPiece;

        const rows = [];

        for (let i = 0; i < this.rows; i++) {
            
            let row = '<!';

            for (let j = 0; j < this.columns; j++) {

                const letter = (() => {

                    const {row, column} = piece.position;

                    const r = i - row;
                    const c = j - column;

                    const size = {
                        rows: piece.array.length,
                        columns: piece.array[0].length
                    };

                    //Draw the current piece
                    if(r >= 0 && c >= 0 && r < size.rows && c < size.columns) {

                        const letter = piece.array[r][c];
                        
                        if(letter !== 0) return letter;
                    }

                    return this.tetris.board[i][j];
                })();
                
                if(letter !== 0){

                    row += PIECE_COLORS[letter]('[]');
                }
                else {
                    
                    row += '--';
                }
            }
            
            row += '!>';
            
            rows.push(row);
        }
        
        //Draw Stats
        rows[1] += `  Rows: ${this.tetris.gameStats.completedRows}`;

        //draw saved pieces
        if(this.tetris.savedPiece){

            const size = {
                rows: this.tetris.savedPiece.array.length,
                columns: this.tetris.savedPiece.array[0].length
            }

            for (let i = 0; i < size.rows; i++) {
            
                let row = '  ';
    
                for (let j = 0; j < size.columns; j++) {

                    const letter = this.tetris.savedPiece.array[i][j];

                    if(letter !== 0){

                        row += PIECE_COLORS[letter]('[]');
                    }
                    else {
                        
                        row += '  ';
                    }
                }

                rows[i + 3] += row;
            }
        }

        rows.push(`<!${'=='.repeat(this.columns)}!>\n`);
        
        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        process.stdout.write(rows.join('\n'), 'utf8');

        return;
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
