"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getParser = getParser;

var _BinaryExpressionParser = require("./BinaryExpressionParser");

var _BinaryExpressionParser2 = _interopRequireDefault(_BinaryExpressionParser);

var _MemberExpressionParser = require("./MemberExpressionParser");

var _MemberExpressionParser2 = _interopRequireDefault(_MemberExpressionParser);

var _IfStatmentParser = require("./IfStatmentParser");

var _IfStatmentParser2 = _interopRequireDefault(_IfStatmentParser);

var _LiteralParser = require("./LiteralParser");

var _LiteralParser2 = _interopRequireDefault(_LiteralParser);

var _IdentifierParser = require("./IdentifierParser");

var _IdentifierParser2 = _interopRequireDefault(_IdentifierParser);

var _LogicalExpressionParser = require("./LogicalExpressionParser");

var _LogicalExpressionParser2 = _interopRequireDefault(_LogicalExpressionParser);

var _CallExpressionParser = require("./CallExpressionParser");

var _CallExpressionParser2 = _interopRequireDefault(_CallExpressionParser);

var _UnaryExpressionPraser = require("./UnaryExpressionPraser");

var _UnaryExpressionPraser2 = _interopRequireDefault(_UnaryExpressionPraser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getParser(type) {
    switch (type) {
        case "BinaryExpression":
            return new _BinaryExpressionParser2.default();
        case "LogicalExpression":
            return new _LogicalExpressionParser2.default();
        case "MemberExpression":
            return new _MemberExpressionParser2.default();
        case "IfStatement":
            return new _IfStatmentParser2.default();
        case "Literal":
            return new _LiteralParser2.default();
        case "Identifier":
            return new _IdentifierParser2.default();
        case "CallExpression":
            return new _CallExpressionParser2.default();
        case "UnaryExpression":
            return new _UnaryExpressionPraser2.default();
        default:
            return null;
    }
}