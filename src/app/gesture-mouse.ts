import {Observable, Observer, ReplaySubject} from "rxjs";
/**
 * Created by yuriel on 2/24/17.
 */

let globalSubject: ReplaySubject<MouseEvent>;

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
    if (null == globalSubject) {
        globalSubject = new ReplaySubject();
        getAnyDragObservable(window).subscribe(globalSubject);
    }
    return globalSubject;
}

export function getDOMODragObservable(dom: HTMLElement): Observable<MouseEvent> {
    return getAnyDragObservable(dom);
}
