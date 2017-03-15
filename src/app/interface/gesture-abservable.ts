import {Observable} from "rxjs";
/**
 * Created by yuriel on 3/15/17.
 */

export interface GestureObservable {
    readonly touch: Observable<OffsetTouchEvent>;
    readonly drag: Observable<MouseEvent>;
    readonly wheel: Observable<WheelEvent>;
}

export interface GestureElement {
    gesture: GestureObservable;
}
