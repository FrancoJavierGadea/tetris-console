

export const PIECES = {
    'L': {
        name: 'L',
        array: [
            ['L', 0],
            ['L', 0],
            ['L', 'L']
        ],
        size: {
            columns: 2,
            rows: 3
        },
        color: {
            dark: '#f0a000',
            light: '#bc6f00'
        }
    },
    'J': {
        name: 'J',
        array: [
            [0, 'J'],
            [0, 'J'],
            ['J', 'J']
        ],
        size: {
            columns: 2,
            rows: 3
        },
        color: {
            dark: '#0051f0',
            light: '#0038bc'
        }
    },
    'S': {
        name: 'S',
        array: [
            [0, 'S', 'S'],
            ['S', 'S', 0]
        ],
        size: {
            columns: 3,
            rows: 2
        },
        color: {
            dark: '#00f000',
            light: '#00bc00'
        }
    },
    'Z': {
        name: 'Z',
        array: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z']
        ],
        size: {
            columns: 3,
            rows: 2
        },
        color: {
            dark: '#f00000',
            light: '#bc0000'
        }
    },
    'T': {
        name: 'T',
        array: [
            ['T', 'T', 'T'],
            [0, 'T', 0]
        ],
        size: {
            columns: 3,
            rows: 2
        },
        color: {
            dark: '#a000f0',
            light: '#7b00bc'
        }
    },
    'O': {
        name: 'O',
        array: [
            ['O', 'O'],
            ['O', 'O']
        ],
        size: {
            columns: 2,
            rows: 2
        },
        color: {
            dark: '#f0f000',
            light: '#bcb800'
        }
    },
    'I': {
        name: 'I',
        array: [
            ['I'],
            ['I'],
            ['I'],
            ['I'] 
        ],
        size: {
            columns: 1,
            rows: 4
        },
        color: {
            dark: '#00f0f0',
            light: '#00bcbc'
        }
    }
};


export function getRandomPiece(){

    const pieces = Object.values(PIECES);

    return pieces.at(Math.floor(Math.random() * pieces.length));
}