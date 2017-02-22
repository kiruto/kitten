/**
 * Created by yuriel on 2/22/17.
 */
function range (start: number, end: number) {
    return Array.from({length: (end - start)}, (v, k) => k + start);
}

function style(dom: HTMLElement, style: any) {
    Object.keys(style).forEach(key => {
        let value = style[key];
        dom.style.setProperty(key, value);
    })
}