import {define} from "./libs";
import {CanvasElementManager} from "./app/canvas-element-manager";
import {CSSElementManager} from "./app/css-element-manager";
import {CONFIGURATION} from "./app/configuration";
/**
 * Created by yuriel on 2/6/17.
 */
let app = {
    CanvasElementManager: CanvasElementManager,
    CSSElementManager: CSSElementManager,
    ivConfig: CONFIGURATION
};

define("kitten", app);
