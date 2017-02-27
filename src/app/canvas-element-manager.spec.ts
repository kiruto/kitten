import {attachRootView, attachActionTo} from "./test-kits";
import {CanvasElementManager, scale, SCALE_RATIO, move, CanvasWorkMode} from "./canvas-element-manager";
import {ImageItem} from "./interface/image-item";
import {Observable} from "rxjs";
/**
 * Created by yuriel on 2/22/17.
 */
describe("Canvas element", () => {
    let rootId = "root-view";
    attachRootView(rootId);
    let mgr = new CanvasElementManager(rootId);
    mgr.initEmptyViews();
    let view = mgr.getImgView();
    view.width = 100;
    view.height = 200;

    it("should attached to root view.", () => {
        expect(document.getElementById(mgr.canvasId)).toBe(mgr.getCanvasView());
    });

    it("should scaled.", () => {
        let view = mgr.getImgView();
        let oldWidth = view.width;
        let s = 200;
        scale(view, s, mgr.imgOrigin);
        expect(view.width).not.toBe(oldWidth);

        s = 0 - s;
        scale(view, s, mgr.imgOrigin);
        expect(view.width).toBe(oldWidth);

        document.getElementById(rootId).remove();
    });

    afterAll(() => {
        document.getElementById(rootId).remove();
    })
});

describe("Canvas manager", () => {
    let rootId = "root-canvas-manager";
    attachRootView(rootId);
    let mgr = new CanvasElementManager(rootId);

    it("should change image", (done) => {
        Observable.of('008', '010', '030', '050', '440', '800')
            // .map(idx => `https://dummyimage.com/600x400/0${idx}/fff`)
            .map(idx => `base/assets-test/images/${idx}.png`)
            .reduce((acc, one, index) => {
                acc.push(one);
                return acc;
            }, [] as string[])
            .map(urls => {
                mgr.loadImageUrls(urls);
                mgr.changeMode(CanvasWorkMode.SCALE);
                return urls;
            })
            .subscribe({
                next: urls => {},
                error: err => done(),
                complete: () => done()
            });

        attachActionTo(rootId, "done", ev => {
            document.getElementById(rootId).remove();
        });

        attachActionTo(rootId, "move", ev => {
            mgr.changeMode(CanvasWorkMode.MOVE);
        });

        attachActionTo(rootId, "scale", ev => {
            mgr.changeMode(CanvasWorkMode.SCALE);
        });

        attachActionTo(rootId, "brightness and contrast", ev => {
            mgr.changeMode(CanvasWorkMode.BRIGHTNESS_CONTRAST);
        });
    });

    // afterAll(() => {
    //     document.getElementById(rootId).remove();
    // });
});
