import {CanvasWorkMode} from "./canvas-work-mode";
import {Observable} from "rxjs";
import {ImageStatus} from "./canvas-image-position";
/**
 * Created by yuriel on 2/28/17.
 */
export interface ElementManager {
    readonly conf: any;
    readonly imageDownloadObservable: Observable<HTMLImageElement>;
    readonly toFrameObservable: Observable<ImageStatus>;
    attr(attr: any): void;
    loadImageUrls(urls: string[]): void;
    changeMode(mode: CanvasWorkMode): void;
    reset(): void;
    prev(): void;
    next(): void;
    destroy(): void;
}