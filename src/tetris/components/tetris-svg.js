

//Cell identifier: inkscape:label="C-row-column"
//Board size: 10x20

import { Tetris } from "@tetris/tetris.js";



export class TetrisSVG extends HTMLElement {

    columns = 10;
    rows = 20;

    constructor(){
        super();
        
        this.SVG_DATA = {
            cellAttr: this.getAttribute('cell-attr'),
            cellPattern: this.getAttribute('cell-pattern'),
            boardClass: this.getAttribute('board-class'),
            savedPieceClass: this.getAttribute('saved-piece-class')
        }

        this.audio = this.querySelector('audio');

        this.tetris = new Tetris();

        //MARK: Key events listeners 
        document.documentElement.addEventListener('keydown', (e) => {

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

                case 'KeyC':
                    this.tetris.savePiece();
                    break;
            }

            this.draw();
        });

        this.initGame();
    }

    //MARK: Init game
    initGame(){

        this.tetris.spawnPiece('T');

        this.draw();

        this.play(1000);

        this.playAudio();
    }

    //MARK: Get Cell
    getCell({row, column, element} = {}){

        const {cellAttr, cellPattern} = this.SVG_DATA;

        const cellID = cellPattern?.replace('{row}', row).replace('{column}', column);

        return element.querySelector(`[${cellAttr}="${cellID}"]`);
    }


    //MARK: Draw board
    draw(){

        this.drawBoard();
        this.drawSavedPiece();
    }

    drawBoard(){

        const piece = this.tetris.currentPiece;

        //Draw Board
        const $BOARD = this.querySelector(`svg g.${this.SVG_DATA.boardClass}`);

        if(!$BOARD) return;

        for (let i = 0; i < this.rows; i++) {
            
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
            
                //Get cell of SVG
                const rect = this.getCell({
                    row: i + 1, 
                    column: j + 1, 
                    element: $BOARD
                });

                rect.setAttribute('class', '');

                if(letter !== 0){

                    rect.classList.toggle(`draw-${letter}`, true);
                }
            }
        }
    }

    //MARK: Draw Saved piece
    drawSavedPiece(){

        const piece = this.tetris.savedPiece;

        const $SAVED_PIECE = this.querySelector(`svg g.${this.SVG_DATA.savedPieceClass}`);

        if(!piece || !$SAVED_PIECE) return;

        $SAVED_PIECE.querySelectorAll('.painted').forEach(path => {

            path.setAttribute('class', '');
        });

        const size = {
            rows: this.tetris.savedPiece.array.length,
            columns: this.tetris.savedPiece.array[0].length
        }

        for (let i = 0; i < size.rows; i++) {

            for (let j = 0; j < size.columns; j++) {

                const letter = this.tetris.savedPiece.array[i][j];

                //Get cell of SVG
                const rect = this.getCell({
                    row: i + 1, 
                    column: j + 1, 
                    element: $SAVED_PIECE
                });

                if(letter !== 0){

                    rect.classList.toggle(`draw-${letter}`, true);
                    rect.classList.toggle('painted', true);
                }
            }
        }
    }

    //MARK: Audio
    playAudio(){

        this.audio.volume = 0.7;

        const ID = setInterval(() => {

            if(window.navigator.userActivation.hasBeenActive){

                this.audio.play();
                clearInterval(ID);
            }

        }, 2000);
    }

    //MARK: Tetris game loop
    #animationID = null;

    play(time = 1000){

        this.pause();

        let delta = 0;
        let lastTime = 0;

        const animation = (t = 0) => {

            delta += t - lastTime;
            lastTime = t;

            if(delta > time){

                delta = 0;

                this.tetris.movePiece({rows: 1});

                this.drawBoard();
            }

            this.#animationID = requestAnimationFrame(animation);
        }

        animation();
    }

    pause(){
    
        if(this.#animationID){

            cancelAnimationFrame(this.#animationID);
        }
    }
}