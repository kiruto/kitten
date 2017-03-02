import {Observable, Observer, ReplaySubject} from "rxjs";
/**
 * Created by yuriel on 2/27/17.
 */

let globalSubject: ReplaySubject<OffsetTouchEvent>;

function getAnyTouchObservable(el: any): Observable<OffsetTouchEvent> {
    let start: Offset[];

    return Observable.create((observer: Observer<OffsetTouchEvent>) => {
        el.addEventListener("touchstart", (ev: TouchEvent) => {
            start = [];
            for (let i = 0; i < ev.touches.length; i ++) {
                let e = ev.touches[i];
                start[i] = { x: e.pageX, y: e.pageY } as Offset;
            }
        }, false);

        el.addEventListener("touchmove", (ev: TouchEvent) => {
            let event = ev as OffsetTouchEvent;
            if (!event.offsets) {
                event.offsets = [];
            }

            for (let i = 0; i < ev.touches.length; i ++) {
                let e = ev.touches[i];
                if (!start[i]) {
                    start[i] = { x: e.pageX, y: e.pageY } as Offset;
                }

                event.offsets[i] = {
                    x: start[i].x - e.pageX,
                    y: start[i].y - e.pageY
                } as Offset;

                start[i].x = e.pageX;
                start[i].y = e.pageY;
            }

            observer.next(event);
        }, false);

        el.addEventListener("touchend", (ev: TouchEvent) => {
            start = null;
        }, false);
    });
}

export function getTouchObservable(): Observable<OffsetTouchEvent> {
    if (null == globalSubject) {
        globalSubject = new ReplaySubject<OffsetTouchEvent>();
        getAnyTouchObservable(window).subscribe(globalSubject);
    }
    return globalSubject;
}

export function getDOMTouchObservable(dom: HTMLElement): Observable<OffsetTouchEvent> {
    return getAnyTouchObservable(dom);
}