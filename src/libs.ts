/**
 * Created by yuriel on 2/22/17.
 */
export function range(start: number, end: number) {
    return Array.from({length: (end - start)}, (v, k) => k + start);
}

export function style(receiverDOM: HTMLElement, style: any) {
    Object.keys(style).forEach(key => {
        let value = style[key];
        receiverDOM.style.setProperty(key, value);
    })
}

export function attribute(receiverDOM: HTMLElement, attr: any) {
    Object.keys(attr).forEach(key => {
        let value = attr[key];
        receiverDOM.setAttribute(key, value);
    })
}

/** export a global attribute on window object. */
export function define(name: string, obj: any) {
    if (!(<any>window)[name]) {
        (<any>window)[name] = obj;
    } else {
        throw `${name} is already defined.`;
    }
}