import Stack from "../../src/util/stack";
import assert from "assert";

describe("Stack", () => {
    let stack;

    beforeEach(() => {
        stack = new Stack();
    });

    it("should create a stack with empty items", () => {
        assert.equal(stack.size(), 0);
    });

    it("should insert element in stack", () => {
        stack.push(1);

        assert.equal(stack.size(), 1);
    });

    it("should remove and return the last item entered on pop", () => {
        stack.push(1);
        stack.push(2);
        const popppedElement = stack.pop();

        assert.equal(popppedElement, 2);
        assert.equal(stack.size(), 1);
    });

    it("should return underflow when stack is empty on pop", () => {
        const poppedElement = stack.pop();

        assert.equal(poppedElement, "Underflow");
    });

    it("should return the last item entered on peek without removing", () => {
        stack.push(1);
        stack.push(2);
        const peekedElement = stack.peek();

        assert.equal(peekedElement, 2);
        assert.equal(stack.size(), 2);
    });

    it("should return the element at the given level without removing on peekToLevel", () => {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.push(4);
        const peekedElement = stack.peekToLevel(2);

        assert.equal(peekedElement, 3);
        assert.equal(stack.size(), 4);
    });

    it("should return undefined when level is greater than size of stack", () => {
        const peekedElement = stack.peekToLevel(2);

        assert.equal(peekedElement, undefined);
    });

    it("should return true if the stack is empty", () => {
        assert.equal(stack.isEmpty(), true);
    });

    it("should return false if the stack is not empty", () => {
        stack.push(1);

        assert.equal(stack.isEmpty(), false);
    });

    it("should return number of elements in stack", () => {
        stack.push(1);
        stack.push(2);

        assert.equal(stack.size(), 2);
    });
});
