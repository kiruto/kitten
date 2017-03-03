import {CanvasWorkMode} from "./canvas-work-mode";
import {Observable} from "rxjs";
/**
 * Created by yuriel on 2/28/17.
 */
export interface ElementManager {
    readonly conf: any;
    readonly imageDownloadObservable: Observable<HTMLImageElement>;
    attr(attr: any): void;
    loadImageUrls(urls: string[]): void;
    changeMode(mode: CanvasWorkMode): void;
    reset(): void;
    destroy(): void;
}