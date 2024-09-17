import { getRandomPiece, PIECES } from "./tetris-pieces";


export class Tetris {

    board = null;
    #currentPiece = null;

    constructor({rows = 20, columns = 10} =  {}){

        this.rows = rows;
        this.colums = columns;

        this.board = Array.from({length: rows}, () => {

            return new Array(columns).fill(0);
        });
    }


    spawnPiece(){

        const piece = getRandomPiece();
        
        //Set piece initial position
        piece.position = {
            row: 0, 
            column: Math.floor((this.colums / 2) - (piece.size.columns / 2))
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

        if(this.detectCollisions({columns, rows})) return;

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

        console.log(piece.position)

        //With the Board
        if(piece.position.column + columns < 0){

            console.log('Border left');
            return true;
        }
        
        if(piece.position.column + columns > this.colums - piece.size.columns){

            console.log('Border Right');
            return true;
        }

        if(piece.position.row + rows > this.rows - piece.size.rows){

            console.log('Border bottom');
            return true;
        }
        
    }


    #intervalID = null;

    play(time = 1000, cb = () => {}){

        if(this.#intervalID) this.pause();

        this.#intervalID = setInterval(() => {

            this.clearPiece();
            this.movePiece({rows: 1});
            this.putPiece();

            if(this.#currentPiece.position.rows > this.rows - this.#currentPiece.size.rows){

                this.spawnPiece();
            }

            cb();

        }, time);
    }

    pause(){

        if(this.#intervalID) clearInterval(this.#intervalID);
    }
}