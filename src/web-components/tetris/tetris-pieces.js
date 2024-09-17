

export const PIECES = {
    'L': {
        name: 'L',
        array: [
            ['L', 0],
            ['L', 0],
            ['L', 0],
            ['L', 'L']
        ],
        size: {
            columns: 2,
            rows: 4
        }
    },
    'J': {
        name: 'J',
        array: [
            [0, 'J'],
            [0, 'J'],
            [0, 'J'],
            ['J', 'J']
        ],
        size: {
            columns: 2,
            rows: 4
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
        }
    }
};


export function getRandomPiece(){

    const pieces = Object.values(PIECES);

    return pieces.at(Math.floor(Math.random() * pieces.length));
}