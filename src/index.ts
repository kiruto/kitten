import {define} from "./libs";
import {CanvasElementManager} from "./app/canvas-element-manager";
import {CSSElementManager} from "./app/css-element-manager";
import {CONFIGURATION} from "./app/configuration";
import {CanvasWorkMode} from "./app/interface/canvas-work-mode";
/**
 * Created by yuriel on 2/6/17.
 */
let app = {
    CanvasElementManager: CanvasElementManager,
    CSSElementManager: CSSElementManager,
    ivConfig: CONFIGURATION,
    mode: CanvasWorkMode
};

define("kitten", app);
