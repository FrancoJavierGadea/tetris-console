import { getRandomPiece, PIECES } from "./tetris-pieces";

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
    #currentPiece = null;

    constructor({rows = 20, columns = 10} =  {}){

        this.rows = rows;
        this.columns = columns;

        this.spawnMode = SPAWN_MODES.RANDOM_ROTATE;

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
    spawnPiece(){

        if(this.#currentPiece?.position?.row <= 1) this.resetBoard();

        const piece = getRandomPiece();
        
        //Set piece initial position
        let row = 0;
        let column = 0;

        switch(this.spawnMode){

            case SPAWN_MODES.CENTER:
                column = Math.floor((this.columns / 2) - (piece.size.columns / 2));
                break;

            case SPAWN_MODES.RANDOM:
            case SPAWN_MODES.RANDOM_ROTATE: 
                column = Math.floor(Math.random() * (this.columns - piece.size.columns));
                break;
        }

        piece.position = { row, column };

        this.#currentPiece = piece;

        if([SPAWN_MODES.RANDOM_ROTATE].includes(this.spawnMode)){

            if(Math.random() > 0.6) {

                this.rotatePiece();
            }
        }

        this.putPiece();
    }

    //MARK: Put piece
    /**
     * Put the **current piece** on the board
     */
    putPiece(){

        const piece = this.#currentPiece;

        for (let i = 0; i < piece.size.rows; i++) {

            for (let j = 0; j < piece.size.columns; j++) {

                const letter = piece.array[i][j];
                
                if(letter !== 0){

                    this.board[piece.position.row + i][piece.position.column + j] = letter;   
                }
            }  
        }
    }

    //MARK: Clear piece
    /**
     * Remove the **current piece** from board
     */
    clearPiece(){

        const piece = this.#currentPiece;

        for (let i = 0; i < piece.size.rows; i++) {

            for (let j = 0; j < piece.size.columns; j++) {

                const letter = piece.array[i][j];
                
                if(letter !== 0){

                    this.board[piece.position.row + i][piece.position.column + j] = 0;   
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

        this.clearPiece();//Remove piece from board

        //Detect collisions
        const collision = this.detectCollisions({columns, rows});
        
        console.log(collision);

        if (collision === COLLIONS.BOTTOM){

            //Put the current piece
            this.putPiece();

            //Check rows
            this.clearRows();

            //Spawn new piece
            this.spawnPiece();

            return;
        }
        else {

            //Don't move the piece
            if(collision !== COLLIONS.NONE) return;
        }

        //Move the piece if not collisions
        if(rows > 0){

            this.#currentPiece.position.row += rows;
        }

        if(columns !== 0) {
            this.#currentPiece.position.column += columns;
        }

        this.putPiece();//Put the current piece
    }


    movePieceToDown(){

        let rows = 0;

        while(this.detectCollisions({rows: rows + 1}) === COLLIONS.NONE){

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

        const piece = this.#currentPiece;

        if(piece.name === PIECES.O.name) return;

        console.log(this.canRotate())

        //Check if piece can rotate
        if(!this.canRotate()) return;

        //Rotate the piece 90 deg
        const {rows, columns} = piece.size;

        const array = Array.from({length: columns}, () => new Array(rows).fill(0));

        for (let i = 0; i < rows; i++) {

            for (let j = 0; j < columns; j++) {

                array[j][rows - 1 - i] = piece.array[i][j];
            }  
        }
        
        piece.array = array;
        piece.size = {
            rows: columns,
            columns: rows
        };
    }

    //MARK: Detect collisions
    detectCollisions({rows = 0, columns = 0} = {}){

        const piece = this.#currentPiece;

        //Border Left
        if(piece.position.column + columns < 0){

            return COLLIONS.LEFT;
        }
        
        //Border Right
        if(piece.position.column + columns > this.columns - piece.size.columns){

            return COLLIONS.RIGHT;
        }

        //Border Bottom
        if(piece.position.row + rows > this.rows - piece.size.rows){

            return COLLIONS.BOTTOM;
        }

        //Collisions with other pieces
        let flag = false;

        for (let i = 0; i < piece.size.rows; i++) {

            for (let j = 0; j < piece.size.columns; j++) {

                const letter = piece.array[i][j];

                if(letter !== 0){

                    const n = this.board
                        .at(piece.position.row + i + rows)
                        ?.at(piece.position.column + j + columns);

                    if(n !== 0) flag = true;
                }
            }  
        }

        if(flag && rows > 0) return COLLIONS.BOTTOM;
        if(flag && columns < 0) return COLLIONS.LEFT;
        if(flag && columns > 0) return COLLIONS.RIGHT;

        return COLLIONS.NONE;
    }

    //MARK: Can rotate
    canRotate(){

        const piece = this.#currentPiece;

        //Border left
        if(piece.position.column + piece.size.rows > this.columns) return false;

        //Border Bottom
        if(piece.position.row + piece.size.columns > this.rows) return false;

        //Collision with other pieces
        for (let i = 0; i < piece.size.rows; i++) {

            for (let j = 0; j < piece.size.columns; j++) {

                const letter = piece.array[i][j];

                if(letter !== 0){

                    const n = this.board
                        .at(piece.position.row + j)
                        ?.at(piece.position.column + (piece.size.rows - 1 - i));

                    if(n !== 0) return false;
                }
            }  
        }

        return true;
    }

    //MARK: Reset board
    resetBoard(){

        for (let i = 0; i < this.rows; i++) {
            
            for (let j = 0; j < this.columns; j++){

                this.board[i][j] = 0;
            } 
        }
    }

    //MARK: Clear rows
    clearRows(){

        for (let i = 0; i < this.rows; i++) {

            let flag = true;

            for (let j = 0; j < this.columns; j++){

                if(this.board[i][j] === 0){
                    flag = false;
                    break;
                };
            } 

            if(flag){

                console.log('clear row');

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
    }


}