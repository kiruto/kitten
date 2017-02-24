import {style} from "../libs";
/**
 * Created by yuriel on 2/24/17.
 */
describe("Init HTML context", () => {
    let html = document.getElementsByTagName("html")[0];
    let body = document.getElementsByTagName("body")[0];
    style(html, {
        height: "100%",
        overflow: "hidden"
    });

    style(body, {
        margin: "0px",
        padding: "0px",
        height: "100%"
    });
});