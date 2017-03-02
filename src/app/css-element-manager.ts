import {style, attribute} from "../libs";
import {Observable, Subscription, ReplaySubject} from "rxjs";
import {ImageItem} from "./interface/image-item";
import {createImgs} from "./multiple-image-loader";
import {getWheelObservable} from "./gesture-wheel";
import {PartialObserver} from "rxjs/Observer";
import {CanvasImagePosition, getPosition} from "./interface/canvas-image-position";
import {ManagerConfigures} from "./interface/magager-configures";
/**
 * Created by yuriel on 2/28/17.
 */

const SCALE_RATIO = 0.01;
const MOVE_RATIO = 1;
const MOVE_TOUCH_RATIO = 1;
const BRIGHTNESS_RATIO = 1;
const CONTRAST_RATIO = 1;
const SCALE_MIN_SIZE = 5;

export let CSSGestureConf = {
    scale: SCALE_RATIO,
    move: MOVE_RATIO,
    touchScale: SCALE_RATIO,
    touchMove: MOVE_TOUCH_RATIO,
    brightness: BRIGHTNESS_RATIO,
    contrast: CONTRAST_RATIO,
    scaleMinSize: SCALE_MIN_SIZE
} as ManagerConfigures;

export class CSSElementManager {
    readonly wrapperId: string;
    readonly imgId: string;
    readonly imageDownloadObservable = new ReplaySubject<HTMLImageElement>();

    private imageItems: ImageItem[];

    /** Image's attributes. Such as "position", "origin" , etc. */
    private imageStatus: CanvasImagePosition;

    /** The image DOM<img> which is viewing now. */
    private currentImageElement: HTMLImageElement;

    private initializedList = false;

    /** Attributes of all children DOM. */
    private commonAttr: any;

    /** Called when viewing image changed (like next, prev and etc). */
    private changeImageSubscriber: Subscription;

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
        this.imageStatus = getPosition();
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

function createImg(id: string): HTMLImageElement {
    let img = document.createElement("img");
    attribute(img, {
        id: id,
    });
    style(img, {

    });
    return img;
}