import {attachRootView} from "./test-kits.spec";
import {CSSElementManager} from "./css-element-manager";
import {Observable} from "rxjs";
import {define} from "../libs";
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
    });

    afterAll(() => {
        // document.getElementById(rootId).remove();
    });
});