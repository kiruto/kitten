import {createImg, createImgs} from "./multiple-image-loader";
import {Observable} from "rxjs";
import {ImageItem} from "./interface/image-item";
/**
 * Created by yuriel on 2/22/17.
 */
describe("The image loader", () => {
    it("should create an invisible image DOM.", done => {
        const IMAGE_URL = "https://dummyimage.com/600x400/000/fff";
        const ID = "img-1";

        createImg(ID, IMAGE_URL).subscribe({
            next: el => {
                expect(el).not.toBeNull();
                document.body.appendChild(el);
                expect(document.getElementById(ID).getAttribute("src")).toEqual(IMAGE_URL);
            },
            error: err => {
                console.log(err);
                done();
            },
            complete: () => {
                done();
            }
        });
    });

    it("should create a list of image DOM.", done => {
        Observable.range(10, 20)
            .map(idx => `https://dummyimage.com/600x400/0${idx}/fff`)
            .reduce((acc, one, index) => {
                acc.push({id: `img-${index}`, url: one} as ImageItem);
                return acc;
            }, [] as ImageItem[])
            .subscribe(list => {
                createImgs(list).subscribe({
                    next: el => {
                        expect(el).not.toBeNull();
                        document.body.appendChild(el);
                        expect(document.getElementById(el.id)).toBe(el);
                        el.remove();
                    },
                    error: err => {
                        console.log(err);
                        done();
                    },
                    complete: () => {
                        done();
                    }
                });
            });
    });
});