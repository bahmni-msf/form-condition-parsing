"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LiteralParser = require("./LiteralParser");

var _LiteralParser2 = _interopRequireDefault(_LiteralParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UnaryExpressionParser = function () {
    function UnaryExpressionParser() {
        _classCallCheck(this, UnaryExpressionParser);
    }

    _createClass(UnaryExpressionParser, [{
        key: "parse",
        value: function parse(data, declarations) {
            return new _LiteralParser2.default().parse(data.argument, declarations);
        }
    }]);

    return UnaryExpressionParser;
}();

exports.default = UnaryExpressionParser;