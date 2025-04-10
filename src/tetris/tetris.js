
import { SPAWN_MODES, COLLISIONS } from "./tetris-constants.js";
import { getPieceByName, getRandomPiece, PIECES, rotatePiece } from "./tetris-pieces.js";


/**
 * @typedef {import("./tetris-constants.js").SPAWN_MODES} SPAWN_MODES
 * @typedef {import("./tetris-pieces.js").TetrisPiece} TetrisPiece
 * 
 * @typedef {Object} TetrisEvents
 * * @property {CustomEvent<{ name: string }>} spawn-piece
 * * @property {CustomEvent<{ collision: boolean, direction: string }>} move-piece
 * * @property {CustomEvent<{ collision: boolean, direction: string }>} rotate-piece
 * * @property {CustomEvent<{ rowCounter: number }>} clear-rows
 * * @property {CustomEvent<>} reset-board
 */

/**
 * @class Tetris
 */
export class Tetris {

    /**@type {(String | 0)[][]} */
    board = null;

    /**@type {TetrisPiece} */
    currentPiece = null;

    /**@type {TetrisPiece} */
    savedPiece = null;

    #eventTarget = new EventTarget();

    /**
     * @constructor
     * @param {{rows:Number, columns:Number, spawnMode:keyof SPAWN_MODES}} params 
     */
    constructor(params =  {}){

        const {
            rows = 20, 
            columns = 10,
            spawnMode = SPAWN_MODES.RANDOM_ROTATE,
        } = params;

        this.rows = rows;
        this.columns = columns;
        
        this.board = Array.from({length: rows}, () => {
            
            return new Array(columns).fill(0);
        });
        
        /**@type {keyof SPAWN_MODES} */
        this.spawnMode = spawnMode;

        this.gameStats = {
            completedRows: 0
        };
    }


    //MARK: Spawn piece
    /**
     * Spawns a new Tetris piece and sets it as the **current piece** based on the specified **spawn mode**.
     *
     * - `SPAWN_MODES.RANDOM`: Spawns a piece at a random column.
     * - `SPAWN_MODES.CENTER`: Spawns a piece in the center of the board.
     * - `SPAWN_MODES.RANDOM_ROTATE`: Spawns a piece randomly and applies a random rotation.
     *
     * If the previous **current piece** is positioned too high on the board (row <= 1), 
     * the game board is reset, and the completed rows counter is cleared.
     *
     * @param {"T" | "L" | "J" | "S" | "Z" | "O" | "I" | null} pieceName - The name of the piece to spawn. If `null`, a random piece is generated.
     */
    spawnPiece(pieceName){

        //Reset Game when the previous piece is out of the board
        if(this.currentPiece?.position?.row <= 1){

            this.gameStats.completedRows = 0;
            this.resetBoard();
        }

        let piece = pieceName ? getPieceByName(pieceName) : getRandomPiece();
        
        const size = {
            columns: piece.array[0].length
        };

        switch(this.spawnMode){
            
            case SPAWN_MODES.CENTER:
                piece.position.column = Math.floor((this.columns / 2) - (size.columns / 2));
                break

            case SPAWN_MODES.RANDOM:
            case SPAWN_MODES.RANDOM_ROTATE:
                piece.position.column = Math.floor(Math.random() * (this.columns - size.columns + 1))
                break;
        }

        if([SPAWN_MODES.RANDOM_ROTATE].includes(this.spawnMode)){

            if(Math.random() > 0.5) piece = rotatePiece(piece);
        }

        this.currentPiece = piece

        this.#eventTarget.dispatchEvent(new CustomEvent('spawn-piece', { detail: {name: piece.name} }));

        this.#hasSwapped = false;
    }

    //MARK: Put piece
    /** Put the **current piece** on the board */
    putPiece(){

        const piece = this.currentPiece;

        const size = {
            rows: piece.array.length,
            columns: piece.array[0].length
        }

        for (let i = 0; i < size.rows; i++) {
            
            for (let j = 0; j < size.columns; j++) {
                
                const letter = piece.array[i][j];
                
                if(letter !== 0){
                    
                    this.board[piece.position.row + i][piece.position.column + j] = letter;   
                }
            }  
        }
    }

    //MARK: Save piece
    #hasSwapped = false;

    /** Saves the current piece. If no previous piece was saved, spawns a new piece */
    savePiece(){

        if(this.#hasSwapped) return;

        if(this.savedPiece){

            const aux = this.currentPiece;

            this.currentPiece = this.savedPiece;

            this.savedPiece = aux;
        }
        else {

            this.savedPiece = this.currentPiece;

            this.currentPiece = null;

            this.spawnPiece();
        }
        
        //Reset position from saved piece
        this.savedPiece.position.row = 0;
        this.savedPiece.position.column = 0;

        this.#hasSwapped = true;
    }

    //MARK: Move Piece
    /**
     * Moves the **current piece** in the direction specified (LEFT, RIGHT, or BOTTOM)
     * Detects collisions between the piece, the board and other pieces
     * Clears full rows when detected
     * Spawns a new piece when the collision is BOTTOM
     *
     * @param {Object} params - Movement parameters
     * @param {number} params.columns - Number of columns to move (LEFT or RIGHT)
     * @param {number} params.rows - Number of rows to move (BOTTOM)
     */
    movePiece({columns = 0, rows = 0}){

        //Detect collisions
        const {collision, direction} = this.detectCollisions({columns, rows});
        
        this.#eventTarget.dispatchEvent(new CustomEvent('move-piece', { detail: {collision, direction} }));

        if(collision){

            if(direction === COLLISIONS.BOTTOM){

                //Put the current piece
                this.putPiece();

                //Check rows
                this.clearRows();

                //Spawn new piece
                this.spawnPiece();
            }

            return;
        }

        //Move the piece if not collisions
        if(rows > 0){

            this.currentPiece.position.row += rows;
        }

        if(columns !== 0) {
            this.currentPiece.position.column += columns;
        }
    }

    //MARK: Move piece to down
    movePieceToDown(){

        let rows = 0;

        while(!this.detectCollisions({rows: rows + 1}).collision){

            rows++;
        }

        //Move to down
        this.movePiece({rows});

        //Move one more to shoot collision and spawn new piece
        this.movePiece({rows: 1});
    }

    //MARK: Rotate piece
    /** Rotates the **current piece** 90 degrees clockwise */
    rotatePiece(){

        const piece = this.currentPiece;
        
        const rotatedPiece = rotatePiece(piece);

        const {collision, direction} = this.detectCollisions({piece: rotatedPiece});

        this.#eventTarget.dispatchEvent(new CustomEvent('rotate-piece', { detail: {collision, direction} }));

        if(collision) return;

        this.currentPiece = rotatedPiece;
    }

    //MARK: Detect collisions
    /**
     * 
     * @param {{rows:number, columns:number, piece:TetrisPiece}} param0 
     * @returns {collision:boolean, direction:string}
     */
    detectCollisions(params = {}){

        const {rows = 0, columns = 0, piece = this.currentPiece} = params;

        const size = {
            rows: piece.array.length,
            columns: piece.array[0].length
        };

        for (let i = 0; i < size.rows; i++) {
            
            for (let j = 0; j < size.columns; j++) {
                
                const letter = piece.array[i][j];
                
                if(letter !== 0){

                    const r = piece.position.row + rows + i;
                    const c = piece.position.column + columns + j;

                    //Check collisions with the board
                    if(c < 0) return {collision:true, direction: COLLISIONS.LEFT };
                    if(c >= this.columns) return {collision:true, direction: COLLISIONS.RIGHT };
                    if(r >= this.rows) return {collision:true, direction: COLLISIONS.BOTTOM };

                    //Check collisions with other pieces
                    const boardLetter = this.board[r][c];

                    if(boardLetter !== 0){

                        if(rows >= 1) return {collision:true, direction: COLLISIONS.BOTTOM };
                        if(columns < 0) return {collision:true, direction: COLLISIONS.LEFT };
                        if(columns > 0) return {collision:true, direction: COLLISIONS.RIGHT };

                        return {collision: true, direction: COLLISIONS.NONE};
                    }

                      
                }
            }  
        }

        return {collision: false, direction: COLLISIONS.NONE};
    }


    //MARK: Reset board
    resetBoard(){

        for (let i = 0; i < this.rows; i++) {
            
            for (let j = 0; j < this.columns; j++){

                this.board[i][j] = 0;
            } 
        }

        this.#eventTarget.dispatchEvent(new CustomEvent('reset-board', { detail: {} }));
    }


    //MARK: Clear rows
    clearRows(){

        let rowCounter = 0;

        for (let i = 0; i < this.rows; i++) {

            let flag = true;

            //Checks if all cells in row are filled
            for (let j = 0; j < this.columns; j++){

                if(this.board[i][j] === 0){
                    flag = false;
                    break;
                };
            } 

            if(flag){

                rowCounter++;

                //Clear the current row
                for (let j = 0; j < this.columns; j++){

                    this.board[i][j] = 0;
                }

                //Mover las filas superiores hacia abajo
                for (let r = i; r > 0; r--) {

                    for (let j = 0; j < this.columns; j++) {

                        this.board[r][j] = this.board[r - 1][j];
                    }
                }

                // Limpiar la fila superior que ahora está vacía
                for (let j = 0; j < this.columns; j++) {

                    this.board[0][j] = 0;
                }

                // Debido a que hemos movido filas hacia abajo, debemos volver a verificar la fila `i`
                // que ahora contiene la fila superior. Esto garantiza que se puedan eliminar varias filas consecutivas.
                i--;  
            }
        }

        if(rowCounter > 0){

            this.#eventTarget.dispatchEvent(new CustomEvent('clear-rows', { detail: {rowCounter} }));

            this.gameStats.completedRows += rowCounter;
        } 
    }


    //MARK: Events
    /**
     * @template {keyof TetrisEvents} K
     * @param {K} event
     * @param {(e:TetrisEvents[K]) => void} listener
     */
    on(event, listener){
        this.#eventTarget.addEventListener(event, listener);
    }

    /**
     * @template {keyof TetrisEvents} K
     * @param {K} event
     * @param {(e:TetrisEvents[K]) => void} listener
     */
    once(event, listener){
        this.#eventTarget.addEventListener(event, listener, { once: true });
    }

    /**
     * @template {keyof TetrisEvents} K
     * @param {K} event
     * @param {(e:TetrisEvents[K]) => void} listener
     */
    off(event, listener){
        this.#eventTarget.removeEventListener(event, listener);
    }
}