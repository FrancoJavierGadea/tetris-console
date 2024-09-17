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

    //Put a piece on board over it position
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

    //Remove a piece from board on it position
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


    movePiece({columns = 0, rows = 0}){

        this.clearPiece();

        //Calculate collisions
        const collision = this.detectCollisions({columns, rows});
        
        console.log(collision);

        if (collision === COLLIONS.BOTTOM){

            //Put the current piece
            this.putPiece();

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

        this.putPiece();
    }

    rotatePiece(){

        const piece = this.#currentPiece;

        if(piece.name === PIECES.O.name) return;

        console.log(this.canRotate())

        if(!this.canRotate()) return;

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

    canRotate(){

        const piece = this.#currentPiece;

        return [
            //Border Right
            piece.position.column + piece.size.rows <= this.columns,

            //Border Bottom
            piece.position.row + piece.size.columns <= this.rows

        ].every(v => v);
    }

    resetBoard(){

        for (let i = 0; i < this.rows; i++) {
            
            for (let j = 0; j < this.columns; j++){

                this.board[i][j] = 0;
            } 
        }
    }

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


    #intervalID = null;

    play(time = 1000, cb = () => {}){

        if(this.#intervalID) this.pause();

        this.#intervalID = setInterval(() => {

            this.movePiece({rows: 1});

            // Ejecuta un callback para actualizar la vista
            cb();

        }, time);
    }

    pause(){

        if(this.#intervalID) clearInterval(this.#intervalID);
    }
}