import {CanvasWorkMode} from "./canvas-work-mode";
/**
 * Created by yuriel on 2/28/17.
 */
export interface ElementManager {
    attr(attr: any): void;
    loadImageUrls(urls: string[]): void;
    changeMode(mode: CanvasWorkMode): void;
    reset(): void;
    destroy(): void;
}