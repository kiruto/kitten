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

export function attachActionTo(id: string, name: string, cb: (ev: MouseEvent) => void) {
    let element = document.getElementById(id);
    let action = document.createElement("a");
    action.onclick = cb;
    action.innerHTML = name;
    action.id = `${id}-action-${name}`;
    element.appendChild(action);
    style(action, {
        padding: "10px",
        display: "block",
        color: "red"
    });
    return action;
}