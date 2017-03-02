import {style, attribute} from "../libs";
import {ElementOrigin} from "./interface/element-origin";
import {CanvasImagePosition, getPosition} from "./interface/canvas-image-position";
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

const SCALE_RATIO = CONFIGURATION.canvas.scale;
const MOVE_RATIO = CONFIGURATION.canvas.move;
const MOVE_TOUCH_RATIO = CONFIGURATION.canvas.touchMove;
const BRIGHTNESS_RATIO = CONFIGURATION.canvas.brightness;
const CONTRAST_RATIO = CONFIGURATION.canvas.contrast;
const SCALE_MIN_SIZE = CONFIGURATION.canvas.scaleMinSize;

export class CanvasElementManager implements ElementManager {
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

    /** Image's attributes. Such as "position", "origin" , etc. */
    private imageStatus: CanvasImagePosition;

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
            this.imageStatus = getPosition();
        }
        this.draw();
    }

    private draw() {
        let context = this.getContext();
        context.canvas.width  = window.innerWidth;
        context.canvas.height = window.innerHeight;
        drawImage(context, this.currentImageElement, this.imageStatus);
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
        this.imageStatus = getPosition();
        this.draw();
    }

    /** Unregistered all callbacks. */
    destroy() {
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
        if (this.imageStatus.scale <= - 1 / SCALE_RATIO) {
            this.imageStatus.scale = 1 - (1 / SCALE_RATIO);
        } else {
            this.imageStatus.canvasOffsetX -= (this.currentImageElement.naturalWidth * increment * SCALE_RATIO) / 2;
            this.imageStatus.canvasOffsetY -= (this.currentImageElement.naturalHeight * increment * SCALE_RATIO) / 2;
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
        this.imageStatus.canvasOffsetX += incrementX;
        this.imageStatus.canvasOffsetY += incrementY;
        this.draw();
    }

    private moveObserver: PartialObserver<MouseEvent> = {
        next: (ev: MouseEvent) => {
            let incrementX = MOVE_RATIO * ev.movementX;
            let incrementY = MOVE_RATIO * ev.movementY;
            this.move(incrementX, incrementY);
        },
        error: err => console.log(err)
    };

    private moveTouchObserver: PartialObserver<OffsetTouchEvent> = {
        next: (ev: OffsetTouchEvent) => {
            let incrementX = - MOVE_TOUCH_RATIO * ev.offsets[0].x;
            let incrementY = - MOVE_TOUCH_RATIO * ev.offsets[0].y;
            this.move(incrementX,incrementY);
        },
        error: err => console.log(err)
    };

    private brightnessContrast(incrementX: number, incrementY: number) {
        this.imageStatus.brightness += (incrementX * BRIGHTNESS_RATIO);

        if (this.imageStatus.brightness > 255) {
            this.imageStatus.brightness = 255;
        } else if (this.imageStatus.brightness < 0) {
            this.imageStatus.brightness = 0;
        }

        this.imageStatus.contrast += (incrementY * CONTRAST_RATIO);

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
    let width = dom.width + increment * SCALE_RATIO * 0.01 * widthOrigin;
    let height = dom.height + increment * SCALE_RATIO * 0.01 * heightOrigin;
    if (width > SCALE_MIN_SIZE && height > SCALE_MIN_SIZE) {
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

function drawImage(context: CanvasRenderingContext2D, img: HTMLImageElement, p: CanvasImagePosition) {
    let scale = 1 + p.scale * SCALE_RATIO;
    let width = img.naturalWidth * scale;
    let height = img.naturalHeight * scale;
    let x = p.canvasOffsetX;
    let y = p.canvasOffsetY;

    context.drawImage(img, x, y, width, height);

    let image = context.getImageData(x, y, width, height);
    let contrast = 1 + (p.contrast / 255);

    for (let idx = 0; idx < image.data.length; idx += 4) {
        image.data[idx] += p.brightness;
        image.data[idx + 1] += p.brightness;
        image.data[idx + 2] += p.brightness;

        image.data[idx] = ((((image.data[idx] / 255) - 0.5) * contrast) + 0.5) * 255;
        image.data[idx + 1] = ((((image.data[idx + 1] / 255) - 0.5) * contrast) + 0.5) * 255;
        image.data[idx + 2] = ((((image.data[idx + 2] / 255) - 0.5) * contrast) + 0.5) * 255;
    }
    context.putImageData(image, p.canvasOffsetX, p.canvasOffsetY);
}
