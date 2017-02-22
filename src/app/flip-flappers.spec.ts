import {FlipFlappers} from "./flip-flappers";
/**
 * Created by yuriel on 2/21/17.
 */

describe("First test for a flapper.", () => {
    it("Should say 'Flapping!'.", () => {
        let flapper = new FlipFlappers();
        expect(flapper.flaping()).toBe("Flapping!");
    });
});