import {Observable, Observer, ReplaySubject} from "rxjs";
import {CONFIGURATION} from "./configuration";
import {PartialObserver} from "rxjs/Observer";
/**
 * Created by yuriel on 2/27/17.
 */

let globalSubject: ReplaySubject<OffsetTouchEvent>;

function getAnyTouchObservable(el: any): Observable<OffsetTouchEvent> {
    let start: Offset[];
    let zoomDist: number;

    return Observable.create((observer: Observer<OffsetTouchEvent>) => {
        el.addEventListener("touchstart", (ev: TouchEvent) => {
            start = [];
            for (let i = 0; i < ev.touches.length; i ++) {
                let e = ev.touches[i];
                start[i] = { x: e.pageX, y: e.pageY } as Offset;
            }
        }, false);

        el.addEventListener("touchmove", (ev: TouchEvent) => {

            /** for move gesture */
            let event = ev as OffsetTouchEvent;
            if (!event.offsets) {
                event.offsets = [];
            }

            if (event.touches.length < 2) {
                event.zoom = 0;
                zoomDist = null;
            } else {
                let p1 = event.touches.item(0);
                let p2 = event.touches.item(1);
                let currentDist = distance(p1.pageX, p1.pageY, p2.pageX, p2.pageY);
                event.zoom = zoomDist? currentDist - zoomDist: 0;
                zoomDist = currentDist;
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
            zoomDist = null;
        }, false);
    });
}

export function getTouchObservable(): Observable<OffsetTouchEvent> {
    if(!globalSubject) {
        globalSubject = new ReplaySubject(0);
        getAnyTouchObservable(window).subscribe(globalSubject)
    }
    return globalSubject;
}

export function getDOMTouchObservable(dom: HTMLElement): Observable<OffsetTouchEvent> {
    return getAnyTouchObservable(dom);
}

export function getTouchThresholdObserver(next: () => void, prev: () => void): PartialObserver<OffsetTouchEvent>  {
    let wheelOffsetY = 0;
    return {
        next: ev => {
            wheelOffsetY += ev.offsets[0].y;
            if (wheelOffsetY > CONFIGURATION.gesture.changeImageThreshold || wheelOffsetY < - CONFIGURATION.gesture.changeImageThreshold) {
                if (ev.offsets[0].y > 0) {
                    next();
                } else if (ev.offsets[0].y < 0) {
                    prev();
                }
                wheelOffsetY = 0;
            }
        },
        error: err => {

        },
        complete: () => {}
    };
}

function distance(x1: number, y1: number, x2:number , y2: number) {
    let calX = x2 - x1;
    let calY = y2 - y1;
    return Math.pow(calX * calX + calY * calY, 0.5);
}