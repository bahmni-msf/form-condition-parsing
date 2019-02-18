"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseContent = parseContent;

var _IfStatmentParser = require("./IfStatmentParser");

var _IfStatmentParser2 = _interopRequireDefault(_IfStatmentParser);

var _stack = require("../util/stack");

var _stack2 = _interopRequireDefault(_stack);

var _logger = require("../util/logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var esprima = require("esprima"),
    estraverse = require("estraverse");

function createAst(content) {
    try {
        return esprima.parse(content, { "loc": true });
    } catch (e) {
        _logger2.default.error(e.message);
        return "";
    }
}

function parseVariableDeclaration(node, declarations) {
    var initOfDeclarations = node.declarations[0].init;

    if (initOfDeclarations) {
        if (initOfDeclarations.property) {
            declarations[node.declarations[0].id.name] = node.declarations[0].init.property.value;
        } else if (initOfDeclarations.value) {
            declarations[node.declarations[0].id.name] = initOfDeclarations.value;
        }
    }
}

function parseContent(content) {
    var ast = createAst(content),
        finalParsedTree = {},
        declarations = {},
        filteredAst = ast.body.filter(function (bodyElement) {
        return bodyElement.type === "ExpressionStatement" && bodyElement.expression.type === "AssignmentExpression" && bodyElement.expression.left.property.name === "rules";
    });

    filteredAst[0].expression.right.properties.forEach(function (concept) {
        var currentConceptName = "";
        var parsedDataList = [];
        var stackOfIfNodes = new _stack2.default();

        try {
            estraverse.traverse(concept, {
                "enter": function enter(node) {
                    currentConceptName = concept.key.value;
                    if (node.type === "VariableDeclaration") {
                        parseVariableDeclaration(node, declarations);
                    }
                    if (node.type === "IfStatement") {
                        if (stackOfIfNodes.isEmpty()) {
                            var parsedIfNode = new _IfStatmentParser2.default().parse(node, declarations);

                            parsedDataList = parsedDataList.concat(parsedIfNode);
                        }
                        stackOfIfNodes.push(node);
                    }
                },
                "leave": function leave(node) {
                    if (node.type === "IfStatement") {
                        stackOfIfNodes.pop(node);
                    }
                }
            });
            finalParsedTree[currentConceptName] = parsedDataList;
            if (parsedDataList.length === 0) {
                _logger2.default.warn("\"" + currentConceptName + "\" returned empty value.");
            }
        } catch (exception) {
            _logger2.default.error("\"" + currentConceptName + "\" did not parse. Error : " + exception.stack);
        }
    });
    return finalParsedTree;
}