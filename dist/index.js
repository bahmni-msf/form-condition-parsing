"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseFormConditions = parseFormConditions;

var _parser = require("./parsers/parser");

function parseFormConditions(content) {
    return (0, _parser.parseContent)(content);
}