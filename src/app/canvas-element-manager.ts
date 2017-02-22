/**
 * Created by yuriel on 2/22/17.
 */
export class CanvasElementManager {
    public readonly id: string;

    constructor(private rootId: string) {
        this.id = `ivc-${rootId}`;
    }

    bind() {
        let root = document.getElementById(this.rootId);
        let view = document.createElement("canvas");
        view.innerHTML = "Not support!";
        view.style.position = "absolute";
        view.style.width = "100%";
        view.style.height = "100%";
        view.style.overflow = "hidden";
        root.appendChild(view);
    }

    getView(): HTMLCanvasElement {
        return document.getElementById(this.id) as HTMLCanvasElement;
    }

    viewImage(img: HTMLImageElement) {
        let context = this.getView().getContext("2d");
        context.drawImage(img, 0, 0);
    }
}