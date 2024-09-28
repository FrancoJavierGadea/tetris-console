

/**
 * @typedef {Object} TetrisPiece
 * @property {String} name - El nombre de la pieza: 'L', 'J', 'S', 'Z', 'T', 'I', 'O'
 * @property {(String | 0)[][]} array - La matriz que define la forma de la pieza, con letras o 0 para espacios vacíos
 * @property {{dark: String, light: String}} color - Los colores de la pieza, con tonos oscuro y claro
 * @property {{row: number, column: number}} position - La posición de la pieza en el tablero
 */


export const PIECES = {
    'L': {
        name: 'L',
        array: [
            [0, 'L', 0],
            [0, 'L', 0],
            [0, 'L', 'L']
        ],
        color: {
            dark: '#f0a000',
            light: '#bc6f00'
        },
        position: {row: 0, column: 0}
    },
    'J': {
        name: 'J',
        array: [
            [0, 'J', 0],
            [0, 'J', 0],
            ['J', 'J', 0]
        ],
        color: {
            dark: '#0051f0',
            light: '#0038bc'
        },
        position: {row: 0, column: 0}
    },
    'S': {
        name: 'S',
        array: [
            [0, 'S', 'S'],
            ['S', 'S', 0],
            [0, 0, 0]
        ],
        color: {
            dark: '#00f000',
            light: '#00bc00'
        },
        position: {row: 0, column: 0}
    },
    'Z': {
        name: 'Z',
        array: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'], 
            [0, 0, 0]
        ],
        color: {
            dark: '#f00000',
            light: '#bc0000'
        },
        position: {row: 0, column: 0}
    },
    'T': {
        name: 'T',
        array: [
            [0, 0, 0],
            ['T', 'T', 'T'],
            [0, 'T', 0]
        ],
        color: {
            dark: '#a000f0',
            light: '#7b00bc'
        },
        position: {row: 0, column: 0}
    },
    'O': {
        name: 'O',
        array: [
            ['O', 'O'],
            ['O', 'O']
        ],
        color: {
            dark: '#f0f000',
            light: '#bcb800'
        },
        position: {row: 0, column: 0}
    },
    'I': {
        name: 'I',
        array: [
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0] 
        ],
        color: {
            dark: '#00f0f0',
            light: '#00bcbc'
        },
        position: {row: 0, column: 0}
    }
};

/**
 * @returns {TetrisPiece} 
 */
export function getRandomPiece(){

    const pieces = Object.values(PIECES);

    const piece = pieces.at(Math.floor(Math.random() * pieces.length));

    return structuredClone(piece); 
}


/**
 * @param {'T' | 'L' | 'J' | 'S' | 'Z' | 'O' | 'I'} name 
 * @returns {TetrisPiece} 
 */
export function getPieceByName(name){

    if(['T', 'L', 'J', 'S', 'Z', 'O', 'I'].includes(name)){

        return structuredClone(PIECES[name]);
    }
    else {

        throw new Error(`${name} is not a name of tetris piece`);
    }
}

/**
 * @param {TetrisPiece} piece
 * @returns {TetrisPiece} 
 */
export function rotatePiece(piece){

    const rows = piece.array.length;
    const columns = piece.array[0].length;

    const rotatedArray = Array.from({length: columns}, () => new Array(rows).fill(0));

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < columns; j++) {

            rotatedArray[j][rows - 1 - i] = piece.array[i][j];
        }  
    }

    const clonePiece = structuredClone(piece);
    
    clonePiece.array = rotatedArray;

    return clonePiece; 
}

