import {attachRootView} from "./test-kits";
import {CanvasElementManager, scale, SCALE_RATIO, move} from "./canvas-element-manager";
import {getDOMWheelObservable, getWheelObservable} from "./gesture";
import {style} from "../libs";
import {loadImgWith} from "./multiple-image-loader";
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

        document.getElementById(rootId).removeChild(view);
    });
});
