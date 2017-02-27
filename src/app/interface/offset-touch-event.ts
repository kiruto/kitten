/**
 * Created by yuriel on 2/27/17.
 */
interface OffsetTouchEvent extends TouchEvent {
    offsets: Offset[];
}

interface Offset {
    x: number;
    y: number;
}