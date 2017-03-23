import {Observable, Observer, ReplaySubject} from "rxjs";
/**
 * Created by yuriel on 2/24/17.
 */

let globalSubject: ReplaySubject<MouseEvent>;

function getAnyDragObservable(el: any): Observable<MouseEvent> {
    let flag = 0;
    let prevEvent: any = null;
    return Observable.create((observer: Observer<MouseEvent>) => {
        el.addEventListener("mousedown", (ev: MouseEvent) => {
            if (ev.which === 1) {
                flag = 1;
            }
            if (!(ev.movementY && ev.movementX)) {
                prevEvent = ev;
            }
        }, false);
        el.addEventListener("mousemove", (ev: MouseEvent) => {
            if (flag === 1 && ev.which === 1) {
                if (!ev.movementX && !ev.movementY) {
                    (<any>ev).movementX = ev.screenX - prevEvent.screenX;
                    (<any>ev).movementY = ev.screenY - prevEvent.screenY;
                }
                observer.next(ev);
            }
            if (!(ev.movementY && ev.movementX)) {
                prevEvent = ev;
            }
        }, false);
        el.addEventListener("mouseup", (ev: MouseEvent) => {
            flag = 0;
            if (!(ev.movementY && ev.movementX)) {
                prevEvent = ev;
            }
        }, false);
    });
}

export function getDragObservable(): Observable<MouseEvent> {
    if (!globalSubject) {
        globalSubject = new ReplaySubject(0);
        getAnyDragObservable(window).subscribe(globalSubject);
    }
    return globalSubject;
}

export function getDOMODragObservable(dom: HTMLElement): Observable<MouseEvent> {
    return getAnyDragObservable(dom);
}
