"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ParserFactory = require("./ParserFactory");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogicalExpressionParser = function () {
    function LogicalExpressionParser() {
        _classCallCheck(this, LogicalExpressionParser);
    }

    _createClass(LogicalExpressionParser, [{
        key: "parse",
        value: function parse(data, declarations) {
            var stringValue = void 0,
                leftValue = void 0,
                rightValue = void 0;

            switch (data.operator) {
                case "||":
                    stringValue = "or ";
                    break;
                default:
                    stringValue = "";
            }

            leftValue = (0, _ParserFactory.getParser)(data.left.type).parse(data.left, declarations);
            rightValue = (0, _ParserFactory.getParser)(data.right.type).parse(data.right, declarations);
            return stringValue === "" ? leftValue + " " + rightValue : leftValue + " " + stringValue + " " + rightValue;
        }
    }]);

    return LogicalExpressionParser;
}();

exports.default = LogicalExpressionParser;