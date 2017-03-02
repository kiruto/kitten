/**
 * Created by yuriel on 2/24/17.
 */
export interface CanvasImagePosition {
    canvasOffsetX?: number;
    canvasOffsetY?: number;
    scale: number;
    brightness: number;
    contrast: number;
}

export function getPosition(): CanvasImagePosition {
    return {
        canvasOffsetX: 0,
        canvasOffsetY: 0,
        scale: 0,
        brightness: 0,
        contrast: 0
    } as CanvasImagePosition;
}