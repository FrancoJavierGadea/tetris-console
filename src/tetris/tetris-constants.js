

/**
 * Enum for piece spawn modes.
 * @readonly
 * @enum {String}
 */
export const SPAWN_MODES = {
    /**
     * No specific spawn mode.
     * The piece will not be automatically positioned.
     * @type {String}
     */
    NONE: 'none',
  
    /**
     * Spawns the piece in a random position on the board.
     * @type {String}
     */
    RANDOM: 'random',
  
    /**
     * Spawns the piece in the center of the board.
     * @type {String}
     */
    CENTER: 'center',
  
    /**
     * Spawns the piece in a random position with a random rotation.
     * @type {String}
     */
    RANDOM_ROTATE: 'random_rotate',
};


/**
 * Enum for collision directions.
 * @readonly
 * @enum {String}
 */
export const COLLISIONS = {
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    NONE: 'none',
};
  