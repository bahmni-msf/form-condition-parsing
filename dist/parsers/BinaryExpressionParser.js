"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ParserFactory = require("./ParserFactory");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BinaryExpressionParser = function () {
    function BinaryExpressionParser() {
        _classCallCheck(this, BinaryExpressionParser);
    }

    _createClass(BinaryExpressionParser, [{
        key: "parse",
        value: function parse(data, declarations) {
            var stringValue = "",
                leftValue = void 0,
                rightValue = "";

            leftValue = (0, _ParserFactory.getParser)(data.left.type).parse(data.left, declarations);

            if (data.left.type !== "CallExpression") {
                rightValue = (0, _ParserFactory.getParser)(data.right.type).parse(data.right, declarations);
                switch (data.operator) {
                    case ">=":
                        stringValue = "greater than or equal to";
                        break;
                    case "<=":
                        stringValue = "less than or equal to";
                        break;
                    case ">":
                        stringValue = "greater than";
                        break;
                    case "<":
                        stringValue = "less than";
                        break;
                    case "==":
                    case "===":
                        stringValue = "is equal to";
                        break;
                    case "!=":
                    case "!==":
                        stringValue = "is not equal to";
                        break;
                    default:
                        stringValue = "";
                }
            } else if (data.right) {
                var rightValueCondition = (0, _ParserFactory.getParser)(data.right.type).parse(data.right, declarations);
                var finalConditon = data.operator + " " + rightValueCondition;

                switch (finalConditon) {
                    case "< 0":
                    case "== -1":
                        leftValue = leftValue.replace("contains", "does not contains");
                        break;
                    default:
                        break;
                }
            }

            return stringValue === "" ? leftValue + " " + rightValue : leftValue + " " + stringValue + " " + rightValue;
        }
    }]);

    return BinaryExpressionParser;
}();

exports.default = BinaryExpressionParser;