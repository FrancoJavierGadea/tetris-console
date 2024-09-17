

//Cell identifier: inkscape:label="C-row-column"
//Board size: 10x20

import { Tetris } from "./tetris";



export class TetrisSVG extends HTMLElement {

    columns = 10;
    rows = 20;

    cellAttr = (r, c) => `inkscape\\:label="C-${r}-${c}"`;

    constructor(){
        super();

        //SVG element
        this.$SVG = {
            getCell: (r, c) => {
                
                return this.querySelector(`svg g.Board rect[${this.cellAttr(r, c)}]`);
            }
        };

        this.tetris = new Tetris();


        this.tetris.spawnPiece();

        this.drawBoard();

        // this.tetris.play(1000, () => {

        //     console.log('draw');
        //     this.drawBoard();
        // });

        //Events
        document.documentElement.addEventListener('keydown', (e) => {

            this.tetris.clearPiece();

            switch (e.key) {

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
            }

            this.tetris.putPiece();

            this.drawBoard();
        });
    }


    drawBoard(){

        for (let i = 0; i < this.rows; i++) {
            
            for (let j = 0; j < this.columns; j++) {

                const cell = this.tetris.board[i][j];
            
                const rect = this.$SVG.getCell(i + 1, j + 1);

                if(cell !== 0){

                    rect.classList.toggle(`draw-${cell}`, true);
                }
                else {

                    rect.setAttribute('class', '');
                }
            }
        }
    }
}