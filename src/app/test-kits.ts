import {style, attribute} from "../libs";
/**
 * Created by yuriel on 2/22/17.
 */
export function attachRootView(id: string) {
    let element = document.getElementById(id);
    if (null == element) {
        element = document.createElement("div");
        style(element, {
            width: "100%",
            height: "100%",
            overflowX: "hidden",
            overflowY: "hidden"
        });
        attribute(element, {id: id});
        document.body.appendChild(element);
    }
    return element;
}