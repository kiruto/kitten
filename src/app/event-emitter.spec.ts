import {EventEmitter} from "./event-emitter";
/**
 * Created by yuriel on 3/3/17.
 */
describe("Event emitter", () => {
    it("should resolve events.", done => {
        let emitter = new EventEmitter<Object>();

        let event1 = { name: "event1" };
        emitter.on("event1", {
            next: val => {
                expect(val).toBe(event1);
                emitter.emit("event2", event2);
            }
        });

        let event2 = { name: "event2" };
        emitter.on("event2", {
            next: val => {
                expect(val).toBe(event2);
                emitter.emit("event3", event3);
            }
        });

        let event3 = { name: "event3" };
        emitter.on("event3", {
            next: val => {
                expect(val).toBe(event3);
                done();
            }
        });

        emitter.emit("event1", event1);
    });
});