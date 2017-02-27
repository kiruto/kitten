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
    expect(element).not.toBeNull();
    let actionBarId = `${id}-action-bar`;
    let actionBar = document.getElementById(actionBarId);
    if (!actionBar) {
        actionBar = document.createElement("div");
        element.appendChild(actionBar);
        attribute(actionBar, {
            id: actionBarId
        });
        style(actionBar, {
            bottom: "0",
            position: "fixed",
            "z-index": "100000"
        });
    }
    let action = document.createElement("button");
    action.onclick = cb;
    action.innerHTML = name;
    action.id = `${id}-action-${name}`;
    actionBar.appendChild(action);
    style(action, {
        padding: "10px",
        margin: "10px",
        display: "block",
        color: "red",
        float: "left"
    });
    return action;
}