import {move, CanvasElementManager} from "./canvas-element-manager";
import {getWheelObservable} from "./gesture-wheel";
import {loadImgWith} from "./multiple-image-loader";
import {style} from "../libs";
import {attachRootView} from "./test-kits";
/**
 * Created by yuriel on 2/23/17.
 */
describe("Image gesture", () => {
    let rootId = "root-view-image-gesture";
    attachRootView(rootId);
    let mgr = new CanvasElementManager(rootId);
    mgr.initEmptyViews();
    let view = mgr.getImgView();
    view.width = 600;
    view.height = 400;
    mgr.imgOrigin.w = 600;
    mgr.imgOrigin.h = 400;
    style(view, {
        position: "absolute",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        margin: "auto"
    });

    const IMAGE_URL = "https://dummyimage.com/600x400/000/fff";

    it("should scales by wheel event.", (done) => {
        loadImgWith(view, IMAGE_URL)
            .map(el => {
                getWheelObservable()
                    .subscribe({
                        next: ev => {
                            /** Log event */
                            // console.log(ev);

                            /** scale dom */
                            // scale(el, ev.deltaY, mgr.imgOrigin);

                            /** move dom */
                            // move(el, ev.deltaX, ev.deltaY);
                            return ev;
                        },
                        error: err => {
                            console.log(err);
                        },
                        complete: () => {}
                    });
                return el;
            })
            .subscribe({
                error: err => {
                    console.log(err);
                    done();
                },
                complete: () => {
                    done();
                }
            });
    });

    afterAll(() => {
        document.getElementById(rootId).remove();
    });
});
