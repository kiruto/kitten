import {style, attribute} from "../libs";
import {ElementOrigin} from "./interface/element-origin";
import {ImageStatus, newImagePosition} from "./interface/canvas-image-position";
import {Subscription, Observable, ReplaySubject} from "rxjs";
import {getWheelObservable} from "./gesture-wheel";
import {PartialObserver} from "rxjs/Observer";
import {createImgs} from "./multiple-image-loader";
import {ImageItem} from "./interface/image-item";
import {getDragObservable} from "./gesture-mouse";
import {getTouchObservable} from "./gesture-mobile";
import {ElementManager} from "./interface/element-manager";
import {CanvasWorkMode} from "./interface/canvas-work-mode";
import {CONFIGURATION} from "./configuration";
/**
 * Created by yuriel on 2/22/17.
 *
 * Core module.
 */

export class CanvasElementManager implements ElementManager {

    /**
     * These values must configured in CONFIGURATION before use, or default values will be used.
     * Should not be changed at runtime, use it as a const (readonly) variable!
     */
    public readonly conf = {
        SCALE_RATIO: CONFIGURATION.canvas.scale,
        MOVE_RATIO: CONFIGURATION.canvas.move,
        MOVE_TOUCH_RATIO: CONFIGURATION.canvas.touchMove,
        BRIGHTNESS_RATIO: CONFIGURATION.canvas.brightness,
        CONTRAST_RATIO: CONFIGURATION.canvas.contrast,
        SCALE_MIN_SIZE: CONFIGURATION.canvas.scaleMinSize
    };

    public readonly canvasId: string;
    public readonly imgId: string;

    /** Images download observable. Called each when complete download. */
    public readonly imageDownloadObservable= new ReplaySubject<HTMLImageElement>();

    /** The origin set of the background image DOM<img> */
    public imgOrigin: ElementOrigin;

    /** The origin set of the canvas DOM */
    public canvasOrigin: ElementOrigin;

    /** The canvas' context. */
    private context: CanvasRenderingContext2D;

    /** Image's status attributes. Such as "position", "origin" , etc. */
    private imageStatus: ImageStatus;

    /** The image DOM<img> which is viewing now. */
    private currentImageElement: HTMLImageElement;

    /** An images show list. Can only initialized once. */
    private imageItems: ImageItem[];

    /** Images element collections. */
    private imageElements: HTMLImageElement[] = [];

    /** Attributes of all children DOM. */
    private commonAttr: any;

    /** Work mode. */
    private mode: CanvasWorkMode;

    /** Called when viewing image changed (like next, prev and etc). */
    private changeImageSubscriber: Subscription;

    /** Called when captured mouse events. */
    private drugSubscriber: Subscription;

    /** Called on mobile */
    private touchSubscriber: Subscription;

    /** If the imageItems is initialized */
    private initializedList = false;

    private destroyed = false;

    constructor(private rootId: string) {
        this.canvasId = `ivc-${rootId}`;
        this.imgId = `ivi-${rootId}`;
    }

    /** Only for test! */
    initEmptyViews() {
        this.getCanvasView();
        this.getImgView();
    }

    /**
     * Set attributes of all children DOM.
     * This method should be called on initialized BEFORE load images.
     */
    attr(attr: any) {
        this.commonAttr = attr;
        attribute(this.getCanvasView(), attr);
        attribute(this.getImgView(), attr);
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

    setCanvas(dom: HTMLCanvasElement) {
        let old = document.getElementById(this.canvasId);
        if (null == old) {
            let root = document.getElementById(this.rootId);
            root.appendChild(dom);
        } else {
            document.getElementById(this.rootId).replaceChild(dom, old)
        }
        this.canvasOrigin = origin(dom);
    }

    setImg(dom: HTMLImageElement) {
        let old = document.getElementById(this.imgId);
        if (null == old) {
            let root = document.getElementById(this.rootId);
            root.appendChild(dom);
        } else {
            document.getElementById(this.rootId).replaceChild(dom, old)
        }
        this.imgOrigin = origin(dom);
    }

    getCanvasView(): HTMLCanvasElement {
        let view = document.getElementById(this.canvasId);
        if (null == view) {
            let root = document.getElementById(this.rootId);
            let canvas = createCanvas(this.canvasId);
            root.appendChild(canvas);
            view = document.getElementById(this.canvasId);
        }
        this.canvasOrigin = origin(view);
        return view as HTMLCanvasElement;
    }

    private getContext() {
        if (null == this.context) {
            this.context = this.getCanvasView().getContext("2d");
        }
        return this.context;
    }

    getImgView(): HTMLImageElement {
        let view = document.getElementById(this.imgId);
        if (null == view) {
            let root = document.getElementById(this.rootId);
            let img = createImg(this.imgId);
            root.appendChild(img);
            view = document.getElementById(this.imgId);
        }
        this.imgOrigin = origin(view);
        return view as HTMLImageElement;
    }

    private renderImage(img: HTMLImageElement) {
        this.currentImageElement = img;
        if (!this.imageStatus) {
            this.imageStatus = newImagePosition();
        }
        this.draw();
    }

    private draw() {
        if (this.destroyed) {
            return;
        }

        let context = this.getContext();
        context.canvas.width  = window.innerWidth;
        context.canvas.height = window.innerHeight;
        let scale = 1 + this.imageStatus.scale * this.conf.SCALE_RATIO;
        let width = this.currentImageElement.naturalWidth * scale;
        let height = this.currentImageElement.naturalHeight * scale;
        let x = this.imageStatus.offsetX;
        let y = this.imageStatus.offsetY;

        context.drawImage(this.currentImageElement, x, y, width, height);

        let imageData = context.getImageData(x, y, width, height);
        let contrast = 1 + (this.imageStatus.contrast / 255);

        for (let idx = 0; idx < imageData.data.length; idx += 4) {

            /** elapsed time here */

            imageData.data[idx] += this.imageStatus.brightness;
            imageData.data[idx + 1] += this.imageStatus.brightness;
            imageData.data[idx + 2] += this.imageStatus.brightness;

            imageData.data[idx] = ((((imageData.data[idx] / 255) - 0.5) * contrast) + 0.5) * 255;
            imageData.data[idx + 1] = ((((imageData.data[idx + 1] / 255) - 0.5) * contrast) + 0.5) * 255;
            imageData.data[idx + 2] = ((((imageData.data[idx + 2] / 255) - 0.5) * contrast) + 0.5) * 255;
        }
        context.putImageData(imageData, this.imageStatus.offsetX, this.imageStatus.offsetY);
    }

    /**
     * The entry method of class.
     * @param list
     */
    private setImageList(list: string[]) {
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
                if (this.commonAttr) {
                    attribute(el, this.commonAttr);
                }
                this.imageElements.push(el);
            },
            error: err => {
            },
            complete: () => {
                this.changeImageSubscriber = getWheelObservable().subscribe(this.wheelObserver);
                this.renderImage(this.imageElements[0]);
            }
        });
    }

    private getImageItemByUrl(url: string): ImageItem {
        return this.imageItems.find((value, index, array) => {
            return value.url.includes(url) || url.includes(value.url)
        });
    }

    private getImageElementByUrl(url: string): HTMLImageElement {
        return this.imageElements.find((el, index, array) => {
            return el.src.includes(url) || url.includes(el.src);
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

    /**
     * Replace old element with new element and draw.
     */

    private loadNextImage() {
        let url = this.currentImageElement.src;
        let item = this.getImageItemByUrl(url);
        let index = this.imageItems.indexOf(item);
        if (index >= this.imageItems.length - 1) {
            return;
        }
        let nextItem = this.imageItems[index + 1];
        this.currentImageElement = this.getImageElementByUrl(nextItem.url);
        this.renderImage(this.currentImageElement);
    }

    private loadPrevImage() {
        let url = this.currentImageElement.src;
        let item = this.getImageItemByUrl(url);
        let index = this.imageItems.indexOf(item);
        if (index <= 0) {
            return;
        }
        let prevItem = this.imageItems[index - 1];
        this.currentImageElement = this.getImageElementByUrl(prevItem.url);
        this.renderImage(this.currentImageElement);
    }

    /** Reset all the changes */
    reset() {
        this.imageStatus = newImagePosition();
        this.draw();
    }

    /** Unregistered all callbacks. */
    destroy() {
        this.destroyed = true;
        this.imageDownloadObservable.unsubscribe();
        this.touchSubscriber = null;
        this.drugSubscriber = null;
        this.changeImageSubscriber = null;

        if (this.changeImageSubscriber)
            this.changeImageSubscriber.unsubscribe();
        if (this.drugSubscriber)
            this.drugSubscriber.unsubscribe();
        if (this.touchSubscriber)
            this.touchSubscriber.unsubscribe();
    }

    changeMode(mode: CanvasWorkMode) {
        if (null != this.drugSubscriber) {
            this.drugSubscriber.unsubscribe();
        }

        if(null != this.touchSubscriber) {
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
                this.touchSubscriber = getTouchObservable().subscribe(this.brightnessConstrastTouchObserver);
                break;
            default:
                break;
        }
    }

    private scale(increment: number) {
        this.imageStatus.scale += increment;
        if (this.imageStatus.scale <= - 1 / this.conf.SCALE_RATIO) {
            this.imageStatus.scale = 1 - (1 / this.conf.SCALE_RATIO);
        } else {
            this.imageStatus.offsetX -= (this.currentImageElement.naturalWidth * increment * this.conf.SCALE_RATIO) / 2;
            this.imageStatus.offsetY -= (this.currentImageElement.naturalHeight * increment * this.conf.SCALE_RATIO) / 2;
        }

        this.draw();
    }

    private scaleObserver: PartialObserver<MouseEvent> = {
        next: (ev: MouseEvent) => this.scale(ev.movementY),
        error: (err: any) => console.log(err)
    };

    private scaleTouchObserver: PartialObserver<OffsetTouchEvent> = {
        next: (ev: OffsetTouchEvent) => this.scale(ev.offsets[0].y),
        error: (err) => console.log(err)
    };

    private move(incrementX: number, incrementY: number) {
        this.imageStatus.offsetX += incrementX;
        this.imageStatus.offsetY += incrementY;
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

        if (this.imageStatus.brightness > 255) {
            this.imageStatus.brightness = 255;
        } else if (this.imageStatus.brightness < 0) {
            this.imageStatus.brightness = 0;
        }

        this.imageStatus.contrast += (incrementY * this.conf.CONTRAST_RATIO);

        if (this.imageStatus.contrast > 255) {
            this.imageStatus.contrast = 255;
        } else if (this.imageStatus.contrast < -255){
            this.imageStatus.contrast = -255;
        }

        this.draw();
    }

    private brightnessContrastObserver: PartialObserver<MouseEvent> = {
        next: (ev: MouseEvent) => this.brightnessContrast(ev.movementX, ev.movementY),
        error: (err: any) => console.log(err)
    };

    private brightnessConstrastTouchObserver: PartialObserver<OffsetTouchEvent> = {
        next: (ev: OffsetTouchEvent) => this.brightnessContrast(- ev.offsets[0].x, - ev.offsets[0].y),
        error: (err: any) => console.log(err)
    }
}

/** module public functions */

/**
 * Scale an absolute DOM.
 * @param dom
 * @param increment
 * @param origin
 */
export function scale(dom: HTMLImageElement, increment: number, origin: ElementOrigin = null) {
    if (dom.width * dom.height == 0) {
        return;
    }
    let widthOrigin, heightOrigin;
    if (origin) {
        widthOrigin = origin.w;
        heightOrigin = origin.h;
    } else {
        widthOrigin = dom.width;
        heightOrigin = dom.height;
    }
    let width = dom.width + increment * this.conf.SCALE_RATIO * 0.01 * widthOrigin;
    let height = dom.height + increment * this.conf.SCALE_RATIO * 0.01 * heightOrigin;
    if (width > this.conf.SCALE_MIN_SIZE && height > this.conf.SCALE_MIN_SIZE) {
        dom.width = width;
        dom.height = height;
    }
}

/**
 * Move an absolute DOM.
 * @param dom
 * @param incrementX
 * @param incrementY
 */
export function move(dom: HTMLElement, incrementX: number, incrementY: number) {
    dom.style.left = `${parseInt(dom.style.left) - incrementX}px`;
    dom.style.top = `${parseInt(dom.style.top) - incrementY}px`;
}


/** module private functions */

function createCanvas(id: string): HTMLCanvasElement {
    let view = document.createElement("canvas") as HTMLCanvasElement;
    view.innerHTML = "Not support!";
    style(view, {
        "position": "absolute",
        "width": "100%",
        "height": "100%",
        "overflow": "hidden",
        "z-index": 2000
    });
    attribute(view, {
        id: id,
        width: window.innerWidth,
        height: window.innerHeight
    });
    return view;
}

function createImg(id: string): HTMLImageElement {
    let view = document.createElement("img") as HTMLImageElement;
    style(view, {
        "position": "absolute",
        "overflow": "hidden",
        "z-index": 1000
    });
    attribute(view, {id: id});
    return view;
}

function origin(dom: HTMLElement): ElementOrigin {
    return {
        oX: dom.offsetLeft,
        oY: dom.offsetTop,
        w: dom.offsetWidth,
        h: dom.offsetHeight
    } as ElementOrigin;
}
