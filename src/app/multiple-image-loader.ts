import {Observable, Observer} from "rxjs";
import {ImageItem} from "./interface/image-item";
import {attribute, style} from "../libs";
/**
 * Created by yuriel on 2/22/17.
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

export function createImg(id: string, url: string): Observable<HTMLImageElement> {
    let img = document.getElementById(id) as HTMLImageElement;
    if (null == img) {
        img = document.createElement("img") as HTMLImageElement;
        style(img, {display: "none"});
        attribute(img, {
            id: id,
            width: "0",
            height: "0"
        });
    }
    return loadImgWith(img, url);
}

export function createImgs(list: Array<ImageItem>): Observable<HTMLImageElement> {
    return Observable.from(list)
        .map(item => createImg(item.id, item.url))
        .mergeAll();
}