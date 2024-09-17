import { getRandomPiece, PIECES } from "./tetris-pieces";

export const COLLIONS = {
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    NONE: 'none'
}

export class Tetris {

    board = null;
    #currentPiece = null;

    constructor({rows = 20, columns = 10} =  {}){

        this.rows = rows;
        this.columns = columns;

        this.board = Array.from({length: rows}, () => {

            return new Array(columns).fill(0);
        });
    }


    spawnPiece(){

        const piece = getRandomPiece();
        
        //Set piece initial position
        piece.position = {
            row: 0, 
            column: Math.floor((this.columns / 2) - (piece.size.columns / 2))
        };

        this.#currentPiece = piece;

        this.putPiece();
    }

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

        if(this.detectCollisions({columns, rows}) !== COLLIONS.NONE) return;

        if(rows > 0){

            this.#currentPiece.position.row += rows;
        }

        if(columns !== 0) {
            this.#currentPiece.position.column += columns;
        }
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

        console.log(piece.position);

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

        if(rows > 0){

            for (let i = 0; i < piece.size.columns; i++) {

                const n = this.board.at(piece.position.row + piece.size.rows + rows - 1)?.at(piece.position.column + i);
                
                if(n !== 0) return COLLIONS.BOTTOM;
            }
        } 

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


    #intervalID = null;

    play(time = 1000, cb = () => {}){

        if(this.#intervalID) this.pause();

        this.#intervalID = setInterval(() => {

            this.clearPiece();
            this.movePiece({rows: 1});
            this.putPiece();

            if(this.detectCollisions({rows: 1}) === COLLIONS.BOTTOM){

                this.spawnPiece();
            }

            cb();

        }, time);
    }

    pause(){

        if(this.#intervalID) clearInterval(this.#intervalID);
    }
}