import {attachRootView} from "./test-kits";
import {CanvasElementManager} from "./canvas-element-manager";
/**
 * Created by yuriel on 2/22/17.
 */
describe("Canvas element", () => {
    let rootId = "root-view";
    attachRootView(rootId);
    it("should attached to root view.", () => {
        let mgr = new CanvasElementManager(rootId);
        mgr.bind();
        expect(document.getElementById(mgr.id)).toBe(mgr.getView());
    })
});