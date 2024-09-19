import { Tetris } from "./tetris";
import { PIECES } from "./tetris-pieces";



export class TetrisCanvas extends HTMLElement {

    /**
     * @type {CanvasRenderingContext2D}¡
     */
    #ctx = null;

    constructor(params = {}){
        super();

        const {
            rows = 20,
            columns = 10
        } = params;

        this.rows = rows;
        this.columns = columns;

        this.tetris = new Tetris({rows, columns});

        this.canvas = this.querySelector('canvas');
        this.#ctx = this.canvas?.getContext('2d');

        this.pieceSize = {
            width: this.canvas?.width / this.columns,
            height: this.canvas?.height / this.rows
        };


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

            this.draw();
        });

        this.init();
    }

    //MARK: Init
    init(){
        this.tetris.spawnPiece();

        this.draw();

        this.play();
    }

    //MARK: Draw
    draw(){

        this.#ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);

        this.#drawPieces();
        this.#drawLines();
    }

    //MARK: Draw pieces
    #drawPieces(){

        const {width, height} = this.pieceSize;

        for (let i = 0; i < this.rows; i++) {
            
            for (let j = 0; j < this.columns; j++) {
                
                let n = this.tetris.board[i][j];

                if(n !== 0){

                    this.#ctx.fillStyle = PIECES[n].color.dark;

                    this.#ctx.beginPath();

                    this.#ctx.rect(width * j, height * i, width, height);
    
                    this.#ctx.fill();
                }
            }
            
        }
    };

    //MARK: Draw Lines
    #drawLines(){

        const {width, height} = this.pieceSize;

        this.#ctx.strokeStyle = '#ffffff';
        this.#ctx.lineWidth = 0.5;

        for (let i = 1; i < this.rows; i++) {
            
            this.#ctx.beginPath();
            this.#ctx.moveTo(0, height * i);
            this.#ctx.lineTo(this.canvas.width, height * i);

            this.#ctx.stroke();
        }

        for (let j = 1; j < this.columns; j++) {
            
            this.#ctx.beginPath();
            this.#ctx.moveTo(width * j, 0);
            this.#ctx.lineTo(width * j, this.canvas.height);

            this.#ctx.stroke();
        }
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

                this.draw();
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