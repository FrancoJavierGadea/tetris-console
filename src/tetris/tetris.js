
import { SPAWN_MODES, COLLISIONS } from "./tetris-constants.js";
import { getPieceByName, getRandomPiece, PIECES, rotatePiece } from "./tetris-pieces.js";

/**
 * @class Tetris
 */
export class Tetris {

    /**@type {(String | 0)[][]} */
    board = null;

    /**@type {import("./tetris-pieces.js").TetrisPiece} */
    currentPiece = null;

    /**@type {import("./tetris-pieces.js").TetrisPiece} */
    savedPiece = null;

    /**
     * @constructor
     * @param {{rows:Number, columns:Number, spawnMode:String, logs:null | {out: (...args) => {}}}} params 
     */
    constructor(params =  {}){

        const {
            rows = 20, 
            columns = 10,
            spawnMode = SPAWN_MODES.RANDOM_ROTATE,
            logs = {
                out: (...args) => console.log(...args)
            }
        } = params;

        
        this.rows = rows;
        this.columns = columns;
        
        this.board = Array.from({length: rows}, () => {
            
            return new Array(columns).fill(0);
        });
        
        /**@type {import("./tetris-constants.js").SPAWN_MODES} */
        this.spawnMode = spawnMode;
        
        /**@type {null | {out: (...args) => {}}} */
        this.logs = logs;

        this.gameStats = {
            completedRows: 0
        };
    }


    //MARK: Spawn piece
    /**
     * Spawns a new piece and sets the **current piece** according to the specified **spawn mode**:
     *
     * - `SPAWN_MODES.RANDOM`: Spawns a piece at a random location.
     * - `SPAWN_MODES.CENTER`: Spawns a piece in the center of the board.
     * - `SPAWN_MODES.RANDOM_ROTATE`: Spawns a piece randomly and rotates it.
     *
     * Resets the board if the previous **current piece** is high on the board.
     */
    spawnPiece(pieceName){

        if(this.currentPiece?.position?.row <= 1) this.resetBoard();

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

        this.currentPiece = piece;

        this.logs?.out('Spawn piece:', {name: piece.name});

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
        const {collision, dir} = this.detectCollisions({columns, rows});
        
        this.logs?.out('Move:', {collision, dir});

        if(collision){

            if(dir === COLLISIONS.BOTTOM){

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

        const {collision, dir} = this.detectCollisions({piece: rotatedPiece});

        this.logs?.out('Rotate:', {collision, dir});

        if(collision) return;

        this.currentPiece = rotatedPiece;
    }

    //MARK: Detect collisions
    detectCollisions({rows = 0, columns = 0, piece = this.currentPiece} = {}){

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
                    if(c < 0) return {collision:true, dir: COLLISIONS.LEFT };
                    if(c >= this.columns) return {collision:true, dir: COLLISIONS.RIGHT };
                    if(r >= this.rows) return {collision:true, dir: COLLISIONS.BOTTOM };

                    //Check collisions with other pieces
                    const boardLetter = this.board[r][c];

                    if(boardLetter !== 0){

                        if(rows >= 1) return {collision:true, dir: COLLISIONS.BOTTOM };
                        if(columns < 0) return {collision:true, dir: COLLISIONS.LEFT };
                        if(columns > 0) return {collision:true, dir: COLLISIONS.RIGHT };

                        return {collision: true, dir: COLLISIONS.NONE};
                    }

                      
                }
            }  
        }

        return {collision: false, dir: COLLISIONS.NONE};
    }


    //MARK: Reset board
    resetBoard(){

        for (let i = 0; i < this.rows; i++) {
            
            for (let j = 0; j < this.columns; j++){

                this.board[i][j] = 0;
            } 
        }

        this.logs?.out('Reset board');
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

            this.logs?.out(`Clear rows: ${rowCounter}`);
            this.gameStats.completedRows += rowCounter;
        } 
    }


}