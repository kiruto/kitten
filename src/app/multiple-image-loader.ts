import {Observable, Observer} from "rxjs";
import {ImageItem} from "./interface/image-item";
import {attribute, style} from "../libs";
/**
 * Created by yuriel on 2/22/17.
 */
/**
 * Download images with an image DOM.
 * this method will replace the "src" attribution of the given DOM.
 * @param dom
 * @param url
 * @returns {Observable<HTMLImageElement>}
 */
export function loadImgWith(dom: HTMLImageElement, url: string): Observable<HTMLImageElement> {
    return Observable.create((observer: Observer<HTMLImageElement>) => {
        dom.setAttribute("src", url);

        dom.onload = (ev: Event) => {
            observer.next(dom);
            observer.complete();
        };

        dom.onabort = (ev: UIEvent) => {
            observer.error(ev);
        };
    })
}

/**
 * Create an offscreen image DOM and download image.
 * @param id DOM id
 * @param url image url
 * @returns {Observable<HTMLImageElement>}
 */
export function createImg(id: string, url: string): Observable<HTMLImageElement> {
    let img = document.getElementById(id) as HTMLImageElement;
    if (null == img) {
        img = document.createElement("img") as HTMLImageElement;
        attribute(img, {
            id: id
        });
    }
    return loadImgWith(img, url);
}

/**
 * Create a list of image DOM and download images.
 * @param list
 * @returns {Observable<HTMLImageElement>}
 */
export function createImgs(list: Array<ImageItem>): Observable<HTMLImageElement> {
    return Observable.from(list)
        .map(item => createImg(item.id, item.url))
        .mergeAll();
}