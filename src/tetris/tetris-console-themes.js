
/**
 * @typedef {Object} TetrisConsoleTheme
 *  @property {string} fill - The character used to represent filled cells
 *  @property {string} empty - The character used to represent empty cells
 *  @property {Object} border - The characters used to represent the border of the game
 *   @property {string} border.left - The character for the left border
 *   @property {string} border.right - The character for the right border
 *   @property {string[]} border.bottom - An array of strings representing the bottom border parts: `[left, center, right]`
 *  @property {Object.<string, number[]>} styles - The ANSI styles for different Tetris piece types, example:
 *  ```
 *  {
 *      'T': [105, 30],
 *      'L': [107, 30],
 *      'J': [104, 30],
 *      'I': [106, 30],
 *      'S': [102, 30],
 *      'Z': [101, 30],
 *      'O': [103, 30],
 *      empty: [30],
 *      border: [90]
 *  }
 *  ```
 */


//MARK: CLASSIC
/** @type {TetrisConsoleTheme} */
export const CLASSIC = {
    fill: '[]', 
    empty: '--', 
    border: {
        left: '<!', 
        right: '!>', 
        bottom: ['<!', '==', '!>']
    },
    styles: {
        'T': [95],
        'L': [97],
        'J': [94],
        'I': [96],
        'S': [92],
        'Z': [91],
        'O': [93],
    }
};


//MARK: MODERN
// '☐' Ballot Box U+2610 dec-9744
// '❑' Lower Right Shadowed White Square U+2751 dec-10065
// '█' Full Block U+2588 dec-9608
// '▀' Upper Half Block U+2580 dec-9600
/** @type {TetrisConsoleTheme} */
export const MODERN = {
    fill: '❑ ',
    empty: '☐ ',
    border: {
        left: '█', 
        right: '█', 
        bottom: ['▀', '▀▀', '▀']
    },
    styles: {
        'T': [105, 30],
        'L': [107, 30],
        'J': [104, 30],
        'I': [106, 30],
        'S': [102, 30],
        'Z': [101, 30],
        'O': [103, 30],
        empty: [37],
        border: [37]
    }
};


//MARK: HEARTS
// '❤' Black Heart U+2764 dec-10084
// '♡' White Heart Suit U+2661 dec-9825
// '❣' Heavy Heart Exclamation U+2763 dec-10083
// '❥' Rotated Heavy Black Heart U+2765 dec-10085
/** @type {TetrisConsoleTheme} */
export const HEARTS = {
    fill: '❤ ',
    empty: '♡ ',
    border: {
        left: '❥ ', 
        right: ' ❥', 
        bottom: ['❥ ', '❣ ', ' ❥']
    },
    styles: {
        'T': [95],
        'L': [97],
        'J': [94],
        'I': [96],
        'S': [92],
        'Z': [91],
        'O': [93],
        empty: [30],
        border: [97]
    }
};


//MARK: getTheme
/**
 * @param {string} name Theme name
 * @returns {TetrisConsoleTheme}
 */
export function getTheme(name = ''){

    switch (true) {

        case ['classic',].includes(name.toLowerCase()): return CLASSIC;

        case ['modern',].includes(name.toLowerCase()): return MODERN;

        case ['hearts',].includes(name.toLowerCase()): return HEARTS;
    
        default: return CLASSIC;
    }
}