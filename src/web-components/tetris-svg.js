

//Cell identifier: inkscape:label="C-row-column"
//Board size: 10x20


export const PIECES = {
    'L': [
        ['L', 0],
        ['L', 0],
        ['L', 0],
        ['L', 'L']
    ],
    'J': [
        [0, 'J'],
        [0, 'J'],
        [0, 'J'],
        ['J', 'J']
    ],
    'S': [
        [0, 'S', 'S'],
        ['S', 'S', 0]
    ],
    'Z': [
        ['Z', 'Z', 0],
        [0, 'Z', 'Z']
    ],
    'T': [
        ['T', 'T', 'T'],
        [0, 'T', 0]
    ],
    'O': [
        ['O', 'O'],
        ['O', 'O']
    ]
};



export class TetrisSVG extends HTMLElement {

    width = 10;
    height = 20;

    #board = null;

    cellAttr = (r, c) => `inkscape\\:label="C-${r}-${c}"`;

    constructor(){
        super();

        this.#board = new Array(this.height).fill()
            .map(() => new Array(this.width).fill(0));

        this.$SVG = {
            getCell: (r, c) => {

                return this.querySelector(`svg g.Board rect[${this.cellAttr(r, c)}]`);
            }
        };

        console.log(this.#board);

        this.putPieceOnBoard(PIECES.Z);

        this.drawBoard();
    }


    putPieceOnBoard(piece = [], position = 6){

        let row = position + 1;
        let column = Math.floor((this.width / 2) - (piece[0].length / 2));

        for (let i = 0; i < piece.length; i++) {

            for (let j = 0; j < piece[i].length; j++) {

                const letter = piece[i][j];
                
                if(letter !== 0){

                    this.#board[row + i][column + j] = letter;   
                }
            }
            
        }

        console.log(this.#board);
    }

    drawBoard(){

        for (let i = 0; i < this.#board.length; i++) {
            
            for (let j = 0; j < this.#board[i].length; j++) {

                const cell = this.#board[i][j];
            
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