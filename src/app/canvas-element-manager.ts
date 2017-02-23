import {style, attribute} from "../libs";
import {ElementOrigin} from "./interface/element-origin";
/**
 * Created by yuriel on 2/22/17.
 */
export class CanvasElementManager {
    public readonly canvasId: string;
    public readonly imgId: string;

    public imgOrigin: ElementOrigin;
    public canvasOrigin: ElementOrigin;

    constructor(private rootId: string) {
        this.canvasId = `ivc-${rootId}`;
        this.imgId = `ivi-${rootId}`;
    }

    initEmptyViews() {
        this.getCanvasView();
        this.getImgView();
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

    viewImage(img: HTMLImageElement) {
        // let context = this.getCanvasView().getContext("2d");
        // context.drawImage(img, 0, 0);
    }
}

/** module public functions */

export const SCALE_RATIO = 1;
export const SCALE_MIN_SIZE = 5;
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
    attribute(view, {id: id});
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
