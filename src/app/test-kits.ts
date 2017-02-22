/**
 * Created by yuriel on 2/22/17.
 */
export function attachRootView(id: string) {
    let element = document.getElementById(id);
    if (null == element) {
        element = document.createElement("div");
        element.style.height = "100%";
        element.style.width = "100%";
        element.style.overflowX = "hidden";
        element.style.overflowY = "hidden";
        element.setAttribute("id", id);
        document.body.appendChild(element);
    }
    return element;
}