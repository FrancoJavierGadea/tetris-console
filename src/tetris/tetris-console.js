import path from "node:path";
import { Tetris } from "./tetris.js";
import { getDefaultPlayerSound, getPlayerSound } from "../utils/PlaySound/PlayerSound.js";
import { CLASSIC, MODERN } from "./tetris-console-themes.js";

/**
 * 
 * @typedef {Object} TetrisConsoleEvents
 * * @property {CustomEvent} start
 * * @property {CustomEvent} end
 * * @property {CustomEvent<{key}>} keydown
 * 
 * 
 * @typedef {Object} TetrisConsoleParams
 *  @property {number} rows Number of rows for the Tetris board, default `20`
 *  @property {number} columns Number of columns for the Tetris board, default `10`
 *  @property {string} player Audio player: `'vlc'`, `'powershell'`, `'afplay'`, `'aplay'`
 *  @property {number} volume Volume for the song, between 0 (mute) and 1 (full volume). Default: `0.5`
 *  @property {string} source Path to the song file. Supports `.mp3` for all players except `aplay`, which only supports `.wav`. Default: `'../assets/tetris.wav'`
 *  @property {import("./tetris-console-themes.js").TetrisConsoleTheme} theme Theme configuration for the Tetris game, defining the characters used for filled and empty cells, border styling and color codes for each piece, default `CLASSIC`
 */



const KEYS = {
    ArrowDown: '\u001b[B',
    ArrowUp: '\u001b[A',
    ArrowLeft: '\u001b[D',
    ArrowRight: '\u001b[C',
    Space: ' ',
    Ctrl_C: '\u0003'
}


function applyANSI(text, styles = []){

    if(styles.length === 0) return text;

    return `\x1b[${styles.join(';')}m${text}\x1b[0m`
}


export class TetrisConsole {

    #soundPlayer = null;
    #eventTarget = new EventTarget();

    /**
     * @constructor
     * @param {TetrisConsoleParams} params 
     */
    constructor(params = {}){

        const {
            rows = 20,
            columns = 10,
            player,
            volume,
            source = path.join(import.meta.dirname, '../assets/tetris.wav'),
            theme = CLASSIC
        } = params;

        this.rows = rows;
        this.columns = columns;

        this.player = player;
        this.volume = volume;

        this.tetris = new Tetris({
            rows, columns, 
        });
        
        //Music
        this.#soundPlayer = this.player ? 
            getPlayerSound(this.player, {source, volume})
            :
            getDefaultPlayerSound({source, volume})
        ;

        this.theme = theme;
    }

    //MARK: Init
    init(){
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        //MARK: Events
        process.stdin.on('data', (key) => {

            this.#eventTarget.dispatchEvent(new CustomEvent('keydown', { 
                detail: {
                    key: Object.keys(KEYS).find(k => key === KEYS[k]) ?? key
                } 
            }));

            // Si presionas Ctrl+C, se sale del programa
            if (key === KEYS.Ctrl_C) { 

                this.#soundPlayer.stop();
                this.#eventTarget.dispatchEvent(new CustomEvent('end'));

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

        this.#eventTarget.dispatchEvent(new CustomEvent('start'));
    }

    //MARK: Draw
    draw(){

        const piece = this.tetris.currentPiece;

        const {styles, border, fill, empty} = this.theme;

        const rows = [];

        for (let i = 0; i < this.rows; i++) {
            
            let row = applyANSI(border.left, styles.border);

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

                    row += applyANSI(fill, styles[letter]);
                }
                else {
                    
                    row += applyANSI(empty, styles.empty);
                }
            }
            
            row += applyANSI(border.right, styles.border);
            
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

                        row += applyANSI(fill, styles[letter]);;
                    }
                    else {
                        
                        row += '  ';
                    }
                }

                rows[i + 3] += row;
            }
        }

        const [left, center, right] = border.bottom;

        rows.push(
            applyANSI(`${left}${center.repeat(this.columns)}${right}\n`, styles.border)
        );
        
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


    //MARK: Events
    /**
     * @template {keyof TetrisConsoleEvents} K
     * @param {K} event
     * @param {(e:CustomEvent<TetrisConsoleEvents[K]>) => void} listener
     */
    on(event, listener){
        this.#eventTarget.addEventListener(event, listener);
    }

    /**
     * @template {keyof TetrisConsoleEvents} K
     * @param {K} event
     * @param {(e:CustomEvent<TetrisConsoleEvents[K]>) => void} listener
     */
    once(event, listener){
        this.#eventTarget.addEventListener(event, listener, { once: true });
    }

    /**
     * @template {keyof TetrisConsoleEvents} K
     * @param {K} event
     * @param {(e:CustomEvent<TetrisConsoleEvents[K]>) => void} listener
     */
    off(event, listener){
        this.#eventTarget.removeEventListener(event, listener);
    }
}
