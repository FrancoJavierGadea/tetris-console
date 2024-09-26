
import { getPieceByName, getRandomPiece, PIECES, rotatePiece } from "./tetris-pieces.js";

export const COLLIONS = {
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    NONE: 'none'
}

export const SPAWN_MODES = {
    RANDOM: 'random',
    CENTER: 'center',
    RANDOM_ROTATE: 'random_rotate'
}

export class Tetris {

    board = null;

    /**
     * @type {import("./tetris-pieces.js").TetrisPiece}
     */
    currentPiece = null;

    constructor(params =  {}){


        const {
            rows = 20, 
            columns = 10,

            logs = {
                out: (...args) => console.log(...args)
            }

        } = params;

        this.logs = logs;

        this.rows = rows;
        this.columns = columns;

        this.spawnMode = SPAWN_MODES.CENTER;

        this.board = Array.from({length: rows}, () => {

            return new Array(columns).fill(0);
        });
    }


    //MARK: Spawn piece
    /**
     * Spawn new piece and set the **current piece** by **spawn mode**:
     * 
     * - `SPAWN_MODES.RANDOM`
     * - `SPAWN_MODES.CENTER`
     * - `SPAWN_MODES.RANDOM_ROTATE`
     * 
     * Reset the board when the previous current **piece** is high on the board
     */
    spawnPiece(pieceName){

        if(this.currentPiece?.position?.row <= 1) this.resetBoard();

        const piece = pieceName ? getPieceByName(pieceName) : getRandomPiece();
        
        this.currentPiece = piece;

        this.logs?.out('Spawn piece:', {name: piece.name});
    }

    //MARK: Put piece
    /**
     * Put the **current piece** on the board
     */
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


    //MARK: Move Piece
    /**
     * Move the **current piece** to left, right and bottom.
     * Detect collisions beetwen Pieces and the board.
     * Check clear rows and Spawn a new Piece when collision is BOTTOM
     * 
     * @param {{columns:Integer, rows:Integer}} params  
     */
    movePiece({columns = 0, rows = 0}){

        //Detect collisions
        const {collision, dir} = this.detectCollisions({columns, rows});
        
        this.logs?.out('Move:', {collision, dir});

        if(collision){

            if(dir === COLLIONS.BOTTOM){

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
    /**
     * 
     *  
     */
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
                    if(c < 0) return {collision:true, dir: COLLIONS.LEFT };
                    if(c >= this.columns) return {collision:true, dir: COLLIONS.RIGHT };
                    if(r >= this.rows) return {collision:true, dir: COLLIONS.BOTTOM };

                    //Check collisions with other pieces
                    const boardLetter = this.board[r][c];

                    if(boardLetter !== 0){

                        if(rows >= 1) return {collision:true, dir: COLLIONS.BOTTOM };
                        if(columns < 0) return {collision:true, dir: COLLIONS.LEFT };
                        if(columns > 0) return {collision:true, dir: COLLIONS.RIGHT };

                        return {collision: true, dir: COLLIONS.NONE};
                    }

                      
                }
            }  
        }

        return {collision: false, dir: COLLIONS.NONE};
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

                // Mover las filas superiores hacia abajo
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
        } 
    }


}