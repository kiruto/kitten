import {style, attribute} from "../libs";
import {Observable, Subscription, ReplaySubject, Observer, Subject} from "rxjs";
import {ImageItem} from "./interface/image-item";
import {createImgs} from "./multiple-image-loader";
import {getWheelObservable} from "./gesture-wheel";
import {PartialObserver} from "rxjs/Observer";
import {ImageStatus, newImagePosition} from "./interface/canvas-image-position";
import {CONFIGURATION} from "./configuration";
import {CanvasWorkMode} from "./interface/canvas-work-mode";
import {getTouchObservable} from "./gesture-mobile";
import {getDragObservable} from "./gesture-mouse";
import {EventEmitter} from "./event-emitter";
/**
 * Created by yuriel on 2/28/17.
 *
 * Core module.
 */

export class CSSElementManager {

    /**
     * These values must configured in CONFIGURATION before use, or default values will be used.
     * Should not be changed at runtime, use it as a const (readonly) variable!
     */
    public readonly conf = {
        SCALE_RATIO: CONFIGURATION.css.scale,
        MOVE_RATIO: CONFIGURATION.css.move,
        MOVE_TOUCH_RATIO: CONFIGURATION.css.touchMove,
        BRIGHTNESS_RATIO: CONFIGURATION.css.brightness,
        CONTRAST_RATIO: CONFIGURATION.css.contrast,
        SCALE_MIN_SIZE: CONFIGURATION.css.scaleMinSize
    };

    readonly wrapperId: string;
    readonly imgId: string;
    readonly imageDownloadObservable = new ReplaySubject<HTMLImageElement>();

    readonly toFrameObservable: Observable<ImageStatus> =
        Observable.create((ob: Observer<ImageStatus>) => {
            this.emitter.on("draw", {
                next: val => ob.next(val),
                error: err => console.log(err),
                complete: () => {}
            });
        });

    private readonly emitter = new EventEmitter<ImageStatus>();

    private imageItems: ImageItem[];

    /** Image's status attributes. Such as "position", "origin" , etc. */
    private imageStatus: ImageStatus;

    /** The image DOM<img> which is viewing now. */
    private currentImageElement: HTMLImageElement;

    private initializedList = false;

    /** Attributes of all children DOM. */
    private commonAttr: any;

    /** Called when viewing image changed (like next, prev and etc). */
    private changeImageSubscriber: Subscription;

    /** Called when captured mouse events. */
    private drugSubscriber: Subscription;

    /** Called on mobile. */
    private touchSubscriber: Subscription;

    /** Called on mobile when two point touches zoom. */
    private zoomSubscriber: Subscription;

    /** Work mode. */
    private mode: CanvasWorkMode;

    constructor(private rootId: string) {
        this.wrapperId = `ivd-${rootId}`;
        this.imgId = `ivi-${rootId}`;
    }

    /**
     * Set attributes of all children DOM.
     * This method should be called on initialized BEFORE load images.
     */
    attr(attr: any) {
        this.commonAttr = attr;
        attribute(this.getWrapperView(), attr);
    }

    /** Reset all the changes */
    reset() {
        this.imageStatus = newImagePosition();
        this.draw();
    }

    /**
     * This method can only called once.
     * @param urls
     */
    loadImageUrls(urls: string[]) {
        if (!this.initializedList) {
            this.initializedList = true;
            this.setImageList(urls);
        } else {
            console.log("loadImageUrls() can only called once!");
        }
    }

    getWrapperView(): HTMLDivElement {
        let view = document.getElementById(this.wrapperId) as HTMLDivElement;
        if(!view) {
            let root = document.getElementById(this.rootId);
            view = createWrapper(this.wrapperId);
            root.appendChild(view);
        }
        return view;
    }

    changeMode(mode: CanvasWorkMode) {
        if (this.drugSubscriber) {
            this.drugSubscriber.unsubscribe();
        }

        if(this.touchSubscriber) {
            this.touchSubscriber.unsubscribe();
        }

        this.mode = mode;

        switch(mode) {
            case CanvasWorkMode.SCALE:
                this.drugSubscriber = getDragObservable().subscribe(this.scaleObserver);
                this.touchSubscriber = getTouchObservable().subscribe(this.scaleTouchObserver);
                break;
            case CanvasWorkMode.MOVE:
                this.drugSubscriber = getDragObservable().subscribe(this.moveObserver);
                this.touchSubscriber = getTouchObservable().subscribe(this.moveTouchObserver);
                break;
            case CanvasWorkMode.BRIGHTNESS_CONTRAST:
                this.drugSubscriber = getDragObservable().subscribe(this.brightnessContrastObserver);
                this.touchSubscriber = getTouchObservable().subscribe(this.brightnessContrastTouchObserver);
                break;
            default:
                break;
        }
    }

    private scale(increment: number) {
        let scale = this.imageStatus.scale;
        this.imageStatus.scale += increment;
        if (this.imageStatus.scale * this.conf.SCALE_RATIO > 1) {
            this.imageStatus.scale = scale;
        }
        this.draw();
    }

    private scaleObserver: PartialObserver<MouseEvent> = {
        next: (ev: MouseEvent) => this.scale(ev.movementY),
        error: (err: any) => console.log(err)
    };

    private scaleTouchObserver: PartialObserver<OffsetTouchEvent> = {
        next: (ev: OffsetTouchEvent) => {
            if (!ev.zoom) {
                this.scale(- ev.offsets[0].y);
            }
        },
        error: (err) => console.log(err)
    };

    private scaleTouchZoomObserver: PartialObserver<OffsetTouchEvent> = {
        next: (ev: OffsetTouchEvent) => {
            if (ev.zoom) {
                this.scale(- ev.zoom);
            }
        },
        error: (err) => console.log(err)
    };

    private move(incrementX: number, incrementY: number) {
        this.imageStatus.offsetX += incrementX;
        this.imageStatus.offsetY += incrementY;
        if (this.imageStatus.offsetX * this.conf.MOVE_RATIO >= 99) {
            this.imageStatus.offsetX = 99 / this.conf.MOVE_RATIO;
        } else if (this.imageStatus.offsetX * this.conf.MOVE_RATIO <= -99) {
            this.imageStatus.offsetX = -99 / this.conf.MOVE_RATIO;
        }

        if (this.imageStatus.offsetY * this.conf.MOVE_RATIO >= 99) {
            this.imageStatus.offsetY = 99 / this.conf.MOVE_RATIO;
        } else if (this.imageStatus.offsetY * this.conf.MOVE_RATIO <= -99) {
            this.imageStatus.offsetY = -99 / this.conf.MOVE_RATIO;
        }

        this.draw();
    }

    private moveObserver: PartialObserver<MouseEvent> = {
        next: (ev: MouseEvent) => {
            let incrementX = this.conf.MOVE_RATIO * ev.movementX;
            let incrementY = this.conf.MOVE_RATIO * ev.movementY;
            this.move(incrementX, incrementY);
        },
        error: err => console.log(err)
    };

    private moveTouchObserver: PartialObserver<OffsetTouchEvent> = {
        next: (ev: OffsetTouchEvent) => {
            let incrementX = - this.conf.MOVE_TOUCH_RATIO * ev.offsets[0].x;
            let incrementY = - this.conf.MOVE_TOUCH_RATIO * ev.offsets[0].y;
            this.move(incrementX,incrementY);
        },
        error: err => console.log(err)
    };

    private brightnessContrast(incrementX: number, incrementY: number) {
        this.imageStatus.brightness += (incrementX * this.conf.BRIGHTNESS_RATIO);

        if (this.imageStatus.brightness > 500) {
            this.imageStatus.brightness = 500;
        } else if (this.imageStatus.brightness < -500) {
            this.imageStatus.brightness = -500;
        }

        this.imageStatus.contrast += (incrementY * this.conf.CONTRAST_RATIO);

        if (this.imageStatus.contrast > 500) {
            this.imageStatus.contrast = 500;
        } else if (this.imageStatus.contrast < -500){
            this.imageStatus.contrast = -500;
        }

        this.draw();
    }

    private brightnessContrastObserver: PartialObserver<MouseEvent> = {
        next: (ev: MouseEvent) => this.brightnessContrast(ev.movementX, ev.movementY),
        error: (err: any) => console.log(err)
    };

    private brightnessContrastTouchObserver: PartialObserver<OffsetTouchEvent> = {
        next: (ev: OffsetTouchEvent) => this.brightnessContrast(- ev.offsets[0].x, - ev.offsets[0].y),
        error: (err: any) => console.log(err)
    };

    private imageElements(): NodeListOf<HTMLImageElement> {
        return this.getWrapperView().getElementsByTagName("img");
    }

    private setImageList(list: string[]) {
        let wrapper = this.getWrapperView();

        Array.prototype
            .forEach
            .call(wrapper.getElementsByTagName("img"), (img: HTMLImageElement) => img.remove());

        Observable.from(list)
            .reduce((acc: ImageItem[], one: string, index: number) => {
                acc.push({
                    id: `ivi-${this.rootId}-item-${index}`,
                    url: one
                } as ImageItem);
                return acc;
            }, [] as ImageItem[])
            .flatMap(list => {
                this.imageItems = list;
                if (this.changeImageSubscriber) {
                    this.changeImageSubscriber.unsubscribe();
                }
                return createImgs(list)
            })
            .subscribe(this.imageDownloadObservable);

        this.imageDownloadObservable.subscribe({
            next: el => {
                attribute(el, { ondragstart: "return false", ondrop: "return false" });
                style(el, {
                    transition: "transform 100ms ease",
                    position: "absolute",
                    "user-select": "none"
                });
                if (this.commonAttr) {
                    attribute(el, this.commonAttr);
                    attribute(el, {
                        "class": `iv-image ${this.rootId}-ivi`
                    });
                }
                wrapper.appendChild(el);
            },
            error: err => console.log(err),
            complete: () => {
                this.changeImageSubscriber = getWheelObservable().subscribe(this.wheelObserver);
                this.zoomSubscriber = getTouchObservable().subscribe(this.scaleTouchZoomObserver);
                this.displayImage(this.imageElements()[0]);
            }
        });
    }

    private wheelObserver: PartialObserver<WheelEvent> = {
        next: ev => {
            if (ev.deltaY > 0) {
                this.loadNextImage();
            } else if (ev.deltaY < 0) {
                this.loadPrevImage();
            }
        },
        error: err => {

        },
        complete: () => {}
    };

    private loadNextImage() {
        let url = this.currentImageElement.src;
        let item = this.getImageItemByUrl(url);
        let index = this.imageItems.indexOf(item);
        if (index >= this.imageItems.length - 1) {
            return;
        }
        let nextItem = this.imageItems[index + 1];
        this.displayImage(this.getImageElementByUrl(nextItem.url));
    }

    private loadPrevImage() {
        let url = this.currentImageElement.src;
        let item = this.getImageItemByUrl(url);
        let index = this.imageItems.indexOf(item);
        if (index <= 0) {
            return;
        }
        let prevItem = this.imageItems[index - 1];
        this.displayImage(this.getImageElementByUrl(prevItem.url));
    }

    private displayImage(el: HTMLImageElement) {
        if (!this.imageStatus) {
            this.imageStatus = newImagePosition();
        }

        if (this.currentImageElement != el) {
            this.currentImageElement = el;
            Array.prototype.forEach.call(this.imageElements(), (img: HTMLImageElement) => {
                if (img === el) {
                    style(img, {display: "block"});
                } else {
                    style(img, {display: "none"});
                }
            });
        }
        this.draw();
    }

    private getImageItemByUrl(url: string): ImageItem {
        return this.imageItems.find((value, index, array) => {
            return value.url.includes(url) || url.includes(value.url)
        });
    }

    private getImageElementByUrl(url: string): HTMLImageElement {
        return Array.prototype.find.call(this.imageElements(), (el: HTMLImageElement) => {
            return el.src.includes(url) || url.includes(el.src);
        });
    }

    private draw() {
        let scale = 1 - this.imageStatus.scale * this.conf.SCALE_RATIO;
        let contrast = (this.imageStatus.contrast ) + 100;
        let brightness = (this.imageStatus.brightness) + 100;
        style(this.currentImageElement, {
            transform: `scale(${scale})`,
            top: `${this.imageStatus.offsetY * this.conf.MOVE_RATIO}%`,
            left: `${this.imageStatus.offsetX * this.conf.MOVE_RATIO}%`,
            filter: `contrast(${contrast}%) brightness(${brightness}%)`
        });
        this.emitter.emit("draw", this.imageStatus);
    }
}

/** module private functions */

function createWrapper(id: string): HTMLDivElement {
    let wrapper = document.createElement("div");
    attribute(wrapper, {
        id: id,
    });
    style(wrapper, {
        width: "100%",
        height: "100%",
    });
    return wrapper;
}
