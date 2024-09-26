

//Cell identifier: inkscape:label="C-row-column"
//Board size: 10x20

import { Tetris } from "@tetris/tetris.js";



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
            }

            this.drawBoard();
        });

        this.initGame();

        //window.pause = this.pause.bind(this);
    }

    //MARK: Init game
    initGame(){

        this.tetris.spawnPiece('T');

        this.drawBoard();

        this.play(1000);

        this.playAudio();
    }


    //MARK: Draw board
    drawBoard(){

        const piece = this.tetris.currentPiece;

        //Draw Board
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
                const rect = this.$SVG.getCell(i + 1, j + 1);

                rect.setAttribute('class', '');

                if(letter !== 0){

                    rect.classList.toggle(`draw-${letter}`, true);
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

            console.log(window.navigator.userActivation.hasBeenActive)

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