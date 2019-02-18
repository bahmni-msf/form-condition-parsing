"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stack = function () {
    function Stack() {
        _classCallCheck(this, Stack);

        this.items = [];
    }

    _createClass(Stack, [{
        key: "push",
        value: function push(element) {
            this.items.push(element);
        }
    }, {
        key: "pop",
        value: function pop() {
            if (this.items.length === 0) {
                return "Underflow";
            }
            return this.items.pop();
        }
    }, {
        key: "peek",
        value: function peek() {
            return this.peekToLevel(1);
        }
    }, {
        key: "peekToLevel",
        value: function peekToLevel(level) {
            if (this.items.length < level) {
                return;
            }
            return this.items[this.items.length - level];
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this.items.length === 0;
        }
    }, {
        key: "size",
        value: function size() {
            return this.items.length;
        }
    }]);

    return Stack;
}();

exports.default = Stack;