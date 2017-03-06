import {Observable, Observer, ReplaySubject} from "rxjs";
import {EventEmitter} from "./event-emitter";
import {CONFIGURATION} from "./configuration";
import {PartialObserver} from "rxjs/Observer";
/**
 * Created by yuriel on 2/22/17.
 */
let prefix = "";
let _addEventListener: string;
// detect event model
if (window.addEventListener) {
    _addEventListener = "addEventListener";
} else {
    _addEventListener = "attachEvent";
    prefix = "on";
}

// detect available wheel event
let support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
        "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

function _addWheelListener(elem: any, eventName: string, callback: (ev: WheelEvent) => void, useCapture: boolean) {
    elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function (originalEvent: WheelEvent) {
        !originalEvent && (originalEvent = window.event as WheelEvent);

        // create a normalized event object
        let event = {
            // keep a ref to the original event object
            originalEvent: originalEvent,
            target: originalEvent.target || originalEvent.srcElement,
            type: "wheel",
            deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
            deltaX: 0,
            deltaY: 0,
            deltaZ: 0,
            preventDefault: function () {
                originalEvent.preventDefault ?
                    originalEvent.preventDefault() :
                    originalEvent.returnValue = false;
            }
        };

        // calculate deltaY (and deltaX) according to the event
        if (support == "mousewheel") {
            event.deltaY = -1 / 40 * originalEvent.wheelDelta;
            // Webkit also support wheelDeltaX
            originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
        } else {
            event.deltaY = originalEvent.detail;
        }

        // it's time to fire the callback
        return callback.call(event);

    }, useCapture || false);
}

function addWheelListener(elem: any, callback: (ev: WheelEvent) => void, useCapture: boolean) {
    _addWheelListener(elem, support, callback, useCapture);

    // handle MozMousePixelScroll in older Firefox
    if(support == "DOMMouseScroll") {
        _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
    }
}

let wheelListener: (ev: WheelEvent) => void = null;

let globalSubject: ReplaySubject<WheelEvent>;

function getAnyWheelObservable(el: any) {
    return Observable.create((observer: Observer<WheelEvent>) => {
        try {
            wheelListener = (ev: WheelEvent) => {
                observer.next(ev);
            };
            addWheelListener(el, wheelListener, false);
        } catch(err) {
            console.log(err);
            observer.error(err);
            wheelListener = null;
        }
    });
}

export function getWheelObservable(): Observable<WheelEvent> {
    if (!globalSubject) {
        globalSubject = new ReplaySubject(0);
        getAnyWheelObservable(window).subscribe(globalSubject);
    }
    return globalSubject;
}

export function getDOMWheelObservable(el: Element): Observable<WheelEvent> {
    return getAnyWheelObservable(el);
}

export function getWheelThresholdObserver(next: () => void, prev: () => void): PartialObserver<WheelEvent> {
    let wheelOffsetY = 0;
    return {
        next: ev => {
            wheelOffsetY += ev.deltaY;
            if (wheelOffsetY > CONFIGURATION.wheel.changeImageThreshold || wheelOffsetY < - CONFIGURATION.wheel.changeImageThreshold) {
                if (ev.deltaY > 0) {
                    next();
                } else if (ev.deltaY < 0) {
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