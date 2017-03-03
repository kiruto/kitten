import {Subject, ReplaySubject} from "rxjs";
import {PartialObserver} from "rxjs/Observer";
/**
 * Created by yuriel on 3/3/17.
 */
export class EventEmitter<T> {
    private subjects: { [name: string]: ReplaySubject<T> } = {};

    emit(name: string, data: T) {
        let fnName = createName(name);
        this.subjects[fnName] || (this.subjects[fnName] = new ReplaySubject(0));
        this.subjects[fnName].next(data);
    }

    on(name: string, handler: PartialObserver<T>) {
        let fnName = createName(name);
        this.subjects[fnName] || (this.subjects[fnName] = new ReplaySubject(0));
        this.subjects[fnName].subscribe(handler);
    }

    off(name: string, handler: PartialObserver<T>) {
        let fnName = createName(name);
        if(this.subjects[fnName]) {
            this.subjects[fnName].unsubscribe();
            delete this.subjects[fnName];
        }
    }

    dispose() {
        for (let prop in this.subjects) {
            if (Object.hasOwnProperty.call(this.subjects, prop)) {
                this.subjects[prop].unsubscribe();
            }
        }

        this.subjects = {};
    }
}

function createName(name: string) {
    return `$ ${name}`;
}