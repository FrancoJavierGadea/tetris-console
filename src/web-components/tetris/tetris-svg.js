

//Cell identifier: inkscape:label="C-row-column"
//Board size: 10x20

import { Tetris } from "./tetris";



export class TetrisSVG extends HTMLElement {

    columns = 10;
    rows = 20;

    
    
    
    constructor(){
        super();
        
        this.cell = {
            attr: this.getAttribute('match-cell-attr'),
            pattern: this.getAttribute('match-cell-pattern')
        }
        
        //SVG element
        this.$SVG = {
            getCell: (r, c) => {
                
                const cellID = this.cell.pattern.replace('{row}', r).replace('{column}', c);

                return this.querySelector(`svg g.Board [${this.cell.attr}="${cellID}"]`);
            }
        };

        this.tetris = new Tetris();

        //MARK: Key events listeners 
        document.documentElement.addEventListener('keydown', (e) => {

            this.tetris.clearPiece();

            switch (e.code) {

                case 'ArrowDown':
                    this.tetris.movePiece({rows: 1});
                    break;

                case 'ArrowLeft':
                    this.tetris.movePiece({columns: -1});
                    break;

                case 'ArrowRight':
                    this.tetris.movePiece({columns: 1});
                    break;

                case 'ArrowUp':
                    this.tetris.rotatePiece();
                    break;

                case 'Space':
                    this.tetris.movePieceToDown();
                    break;
            }

            this.tetris.putPiece();

            this.drawBoard();
        });

        this.initGame();
    }

    //MARK: Init game
    initGame(){

        this.tetris.spawnPiece();

        this.drawBoard();

        this.play(1000);
    }

    //MARK: Draw board
    drawBoard(){

        for (let i = 0; i < this.rows; i++) {
            
            for (let j = 0; j < this.columns; j++) {

                const cell = this.tetris.board[i][j];
            
                const rect = this.$SVG.getCell(i + 1, j + 1);

                rect.setAttribute('class', '');

                if(cell !== 0){

                    rect.classList.toggle(`draw-${cell}`, true);
                }
            }
        }
    }


    //MARK: Tetris game loop
    #intervalID = null;

    play(time = 1000){

        if(this.#intervalID) this.pause();

        this.#intervalID = setInterval(() => {

            this.tetris.movePiece({rows: 1});

            this.drawBoard();

        }, time);
    }

    pause(){

        if(this.#intervalID) clearInterval(this.#intervalID);
    }
}