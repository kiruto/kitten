import {Observable, Observer} from "rxjs";
/**
 * Created by yuriel on 2/24/17.
 */

function getAnyDragObservable(el: any): Observable<MouseEvent> {
    let flag = 0;
    return Observable.create((observer: Observer<MouseEvent>) => {
        el.addEventListener("mousedown", (ev: MouseEvent) => {
            flag = 1;
        }, false);
        el.addEventListener("mousemove", (ev: MouseEvent) => {
            if (flag === 1) {
                observer.next(ev);
            }
        }, false);
        el.addEventListener("mouseup", (ev: MouseEvent) => {
            flag = 0;
        }, false);
    });
}

export function getDragObservable(): Observable<MouseEvent> {
    return getAnyDragObservable(window);
}

export function getDOMODragObservable(dom: HTMLElement): Observable<MouseEvent> {
    return getAnyDragObservable(dom);
}
