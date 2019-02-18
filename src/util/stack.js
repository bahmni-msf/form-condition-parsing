export default class Stack {

    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.items.length === 0) {
            return "Underflow";
        }
        return this.items.pop();
    }

    peek() {
        return this.peekToLevel(1);
    }

    peekToLevel(level) {
        if (this.items.length < level) {
            return;
        }
        return this.items[ this.items.length - level ];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

}
