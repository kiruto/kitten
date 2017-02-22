import {Observable, Observer} from "rxjs";
import {ImageItem} from "./interface/image-item";
/**
 * Created by yuriel on 2/22/17.
 */
export function createImg(id: string, url: string): Observable<HTMLImageElement> {
    return Observable.create((observer: Observer<HTMLImageElement>) => {
        let img = document.createElement("img") as HTMLImageElement;
        img.setAttribute("id", id);
        img.setAttribute("src", url);
        img.setAttribute("width", "0");
        img.setAttribute("height", "0");
        img.style.display = "none";

        img.onload = (ev: Event) => {
            observer.next(img);
            observer.complete();
        };

        img.onabort = (ev: UIEvent) => {
            observer.error(ev);
        };
    });
}

export function createImgs(list: Array<ImageItem>): Observable<HTMLImageElement> {
    return Observable.from(list)
        .map(item => createImg(item.id, item.url))
        .mergeAll();
}