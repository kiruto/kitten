/**
 * Created by yuriel on 3/2/17.
 */

export const CONFIGURATION = {
    canvas: {
        scale: 0.01,
        move: 1,
        touchScale: 0.01,
        touchMove: 1,
        brightness: 1,
        contrast: 1,
        scaleMinSize: 5
    },
    css: {
        scale: 0.01,
        move: 0.3,

        /** Range of (0.0, 1.0), bigger is faster. */
        touchScale: 0.01,

        /** Range of (0.0, 1.0), bigger is faster. */
        touchMove: 0.3,
        brightness: 1,
        contrast: 1,
        scaleMinSize: 5
    },
    gesture: {
        changeImageThreshold: 30,
    },
    wheel: {
        changeImageThreshold: 30,
    }
};