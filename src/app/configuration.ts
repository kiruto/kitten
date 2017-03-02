/**
 * Created by yuriel on 3/2/17.
 */

const CANVAS_SCALE_RATIO = 0.01;
const CANVAS_MOVE_RATIO = 1;
const CANVAS_MOVE_TOUCH_RATIO = 1;
const CANVAS_BRIGHTNESS_RATIO = 1;
const CANVAS_CONTRAST_RATIO = 1;
const CANVAS_SCALE_MIN_SIZE = 5;

const CSS_SCALE_RATIO = 0.01;
const CSS_MOVE_RATIO = 0.3;
const CSS_MOVE_TOUCH_RATIO = 0.3;
const CSS_BRIGHTNESS_RATIO = 1;
const CSS_CONTRAST_RATIO = 1;
const CSS_SCALE_MIN_SIZE = 5;

export const CONFIGURATION = {
    canvas: {
        scale: CANVAS_SCALE_RATIO,
        move: CANVAS_MOVE_RATIO,
        touchScale: CANVAS_SCALE_RATIO,
        touchMove: CANVAS_MOVE_TOUCH_RATIO,
        brightness: CANVAS_BRIGHTNESS_RATIO,
        contrast: CANVAS_CONTRAST_RATIO,
        scaleMinSize: CANVAS_SCALE_MIN_SIZE
    },
    css: {
        scale: CSS_SCALE_RATIO,
        move: CSS_MOVE_RATIO,

        /** Range of (0.0, 1.0), bigger is faster. */
        touchScale: CSS_SCALE_RATIO,

        /** Range of (0.0, 1.0), bigger is faster. */
        touchMove: CSS_MOVE_TOUCH_RATIO,
        brightness: CSS_BRIGHTNESS_RATIO,
        contrast: CSS_CONTRAST_RATIO,
        scaleMinSize: CSS_SCALE_MIN_SIZE
    }
};