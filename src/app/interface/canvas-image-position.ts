/**
 * Created by yuriel on 2/24/17.
 */
export interface ImageStatus {
    offsetX?: number;
    offsetY?: number;
    scale: number;
    brightness: number;
    contrast: number;
}

export function newImagePosition(): ImageStatus {
    return {
        offsetX: 0,
        offsetY: 0,
        scale: 0,
        brightness: 0,
        contrast: 0
    } as ImageStatus;
}