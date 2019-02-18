"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ParserFactory = require("./ParserFactory");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CallExpressionParser = function () {
    function CallExpressionParser() {
        _classCallCheck(this, CallExpressionParser);
    }

    _createClass(CallExpressionParser, [{
        key: "parse",
        value: function parse(data, declarations) {
            var calleeValue = (0, _ParserFactory.getParser)(data.callee.type).parse(data.callee, declarations);
            var argumentValues = "";
            var counter = 0;
            var noOfArguments = data.arguments.length;

            data.arguments.forEach(function (argument) {
                counter++;
                argumentValues = argumentValues + " " + (0, _ParserFactory.getParser)(argument.type).parse(argument, declarations);
                if (counter < noOfArguments) {
                    argumentValues = argumentValues + " &";
                }
            });

            return "" + calleeValue + argumentValues;
        }
    }]);

    return CallExpressionParser;
}();

exports.default = CallExpressionParser;