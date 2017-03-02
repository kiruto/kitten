import {attachRootView, attachActionTo} from "./test-kits.spec";
import {CSSElementManager} from "./css-element-manager";
import {Observable} from "rxjs";
import {define} from "../libs";
import {CanvasWorkMode} from "./interface/canvas-work-mode";
/**
 * Created by yuriel on 2/28/17.
 */
define("CSSElementManager", CSSElementManager);

describe("CSS element manager", () => {
    let rootId = "cem-root-view";
    attachRootView(rootId);
    let mgr = new CSSElementManager(rootId);
    let wrapper = mgr.getWrapperView();

    it("should attached to root view.", (done) => {
        expect(document.getElementById(mgr.wrapperId)).toBe(wrapper);
        done();
    });

    it("should load images", (done) => {
        Observable.of('008', '010', '030', '050', '440', '800')
            .map(idx => `base/assets-test/images/${idx}.png`)
            .reduce((acc, one, index) => {
                acc.push(one);
                return acc;
            }, [] as string[])
            .flatMap(urls => {
                mgr.loadImageUrls(urls);
                return mgr.imageDownloadObservable;
            })
            .subscribe({
                next: el => {

                },
                error: err => console.log(err),
                complete: () => {
                    done();
                }
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

        attachActionTo(rootId, "reset", ev => {
            mgr.reset();
        });
    });

    afterAll(() => {
        // document.getElementById(rootId).remove();
    });
});