"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ParserFactory = require("./ParserFactory");

var _stack = require("../util/stack");

var _stack2 = _interopRequireDefault(_stack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var estraverse = require("estraverse");

var IfStatementParser = function () {
    function IfStatementParser() {
        _classCallCheck(this, IfStatementParser);

        this.parse = this.parse.bind(this);
    }

    _createClass(IfStatementParser, [{
        key: "parse",
        value: function parse(data, declarations) {
            var _this = this;

            var nodeStack = new _stack2.default();
            var parsedNodes = [];

            this.declarations = declarations;

            estraverse.traverse(data, {
                "enter": function enter(node, parent) {
                    if (node.type === "IfStatement" || parent && node.type === "BlockStatement" && parent.alternate === node) {
                        node.nestedConditions = [];
                        node.conceptsToHide = [];
                        node.conceptsToShow = [];
                        nodeStack.push(node);
                    }
                },
                "leave": function leave(node, parent) {
                    if (node.type === "MemberExpression" && node.object && node.object.type === "MemberExpression") {
                        _this.parseMemberExpressionBlocks(nodeStack, node, parent, parsedNodes);
                    }
                    if (node.type === "IfStatement" || parent && node.type === "BlockStatement" && parent.alternate === node) {
                        _this.parseIfStatementBlocks(nodeStack, node, declarations, parsedNodes);
                    }
                    if (node.type === "ReturnStatement" && node.argument.type === "ObjectExpression") {
                        var currentNode = nodeStack.peek();
                        var conceptsToHide = [],
                            conceptsToShow = [];

                        node.argument.properties.forEach(function (property) {
                            if (property.key.name === "enable" || property.key.name === "show") {
                                property.value.elements.forEach(function (element) {
                                    return conceptsToShow.push((0, _ParserFactory.getParser)(element.type).parse(element, _this.declarations));
                                });
                            } else if (property.key.name === "disable" || property.key.name === "hide") {
                                property.value.elements.forEach(function (element) {
                                    return conceptsToHide.push((0, _ParserFactory.getParser)(element.type).parse(element, _this.declarations));
                                });
                            }
                        });

                        _this.addParsedNodesToTree(nodeStack, node, conceptsToHide, conceptsToShow, parsedNodes, currentNode);
                    }
                }
            });
            return parsedNodes.reverse();
        }
    }, {
        key: "parseIfStatementBlocks",
        value: function parseIfStatementBlocks(nodeStack, node, declarations, parsedNodes) {
            var currentNode = nodeStack.pop();
            var stringValue = "if selected answers for ";
            var condition = void 0;

            if (node.type !== "BlockStatement") {
                var testCondition = (0, _ParserFactory.getParser)(node.test.type).parse(node.test, declarations);

                condition = "" + stringValue + testCondition;

                currentNode.condition = condition;
            } else {
                currentNode.condition = "";
                condition = "";
            }

            var parentNode = nodeStack.peek();

            if (parentNode) {
                if (currentNode === parentNode.alternate) {
                    this.parseAlternateIfBlock(nodeStack, node, condition, currentNode, parsedNodes);
                } else {
                    this.addAsNestedConditionToParent(parentNode, condition, currentNode);
                }
            }
            if (nodeStack.isEmpty()) {
                this.addToRootLevelConditions(parsedNodes, condition, currentNode);
            }
        }
    }, {
        key: "addToRootLevelConditions",
        value: function addToRootLevelConditions(parsedNodes, condition, currentNode) {
            parsedNodes.push({
                condition: condition,
                conceptsToHide: currentNode.conceptsToHide,
                conceptsToShow: currentNode.conceptsToShow,
                nestedConditions: currentNode.nestedConditions.reverse()
            });
        }
    }, {
        key: "addAsNestedConditionToParent",
        value: function addAsNestedConditionToParent(parentNode, condition, currentNode) {
            parentNode.nestedConditions.push({
                condition: condition,
                conceptsToHide: currentNode.conceptsToHide,
                conceptsToShow: currentNode.conceptsToShow,
                nestedConditions: currentNode.nestedConditions.reverse()
            });
        }
    }, {
        key: "parseAlternateIfBlock",
        value: function parseAlternateIfBlock(nodeStack, node, condition, currentNode, parsedNodes) {
            var _findRootIfParentForA = this.findRootIfParentForAlternate(nodeStack, node),
                rootIfParent = _findRootIfParentForA.rootIfParent;

            if (rootIfParent) {
                this.addAsNestedConditionToParent(rootIfParent, condition, currentNode);
            } else {
                this.addToRootLevelConditions(parsedNodes, condition, currentNode);
            }
        }
    }, {
        key: "parseMemberExpressionBlocks",
        value: function parseMemberExpressionBlocks(nodeStack, node, parent, parsedNodes) {
            var currentNode = nodeStack.peek();
            var conceptsToHide = [],
                conceptsToShow = [];

            this.parseMemeberExpressionConcepts(node, parent, conceptsToHide, conceptsToShow);
            this.addParsedNodesToTree(nodeStack, node, conceptsToHide, conceptsToShow, parsedNodes, currentNode);
        }
    }, {
        key: "addParsedNodesToTree",
        value: function addParsedNodesToTree(nodeStack, node, conceptsToHide, conceptsToShow, parsedNodes, currentNode) {
            var _findRootIfParentForA2 = this.findRootIfParentForAlternate(nodeStack, node),
                rootIfParent = _findRootIfParentForA2.rootIfParent,
                rootIfParentIndex = _findRootIfParentForA2.rootIfParentIndex;

            if (rootIfParentIndex > 1) {
                var parentNode = rootIfParent;

                if (parentNode) {
                    this.addAsNestedConditionToParent(parentNode, "", currentNode);
                } else {
                    this.addToRootLevelConditions(parsedNodes, "", currentNode);
                }
            } else {
                currentNode.conceptsToHide = currentNode.conceptsToHide.concat(conceptsToHide);
                currentNode.conceptsToShow = currentNode.conceptsToShow.concat(conceptsToShow);
            }
        }
    }, {
        key: "parseMemeberExpressionConcepts",
        value: function parseMemeberExpressionConcepts(node, parent, conceptsToHide, conceptsToShow) {
            var _this2 = this;

            if (node.object.property.name === "hide" || node.object.property.name === "disable") {
                parent.arguments.forEach(function (argument) {
                    conceptsToHide.push((0, _ParserFactory.getParser)(argument.type).parse(argument, _this2.declarations));
                });
            } else if (node.object.property.name === "show" || node.object.property.name === "enable") {
                parent.arguments.forEach(function (argument) {
                    conceptsToShow.push((0, _ParserFactory.getParser)(argument.type).parse(argument, _this2.declarations));
                });
            }
        }
    }, {
        key: "findRootIfParentForAlternate",
        value: function findRootIfParentForAlternate(nodeStack, node) {
            var rootIfParent = nodeStack.peek();
            var rootIfParentIndex = 1;

            while (rootIfParentIndex <= nodeStack.size() && rootIfParent.alternate && JSON.stringify(rootIfParent.alternate).includes(JSON.stringify(node))) {
                rootIfParent = nodeStack.peekToLevel(++rootIfParentIndex);
            }
            return { rootIfParent: rootIfParent, rootIfParentIndex: rootIfParentIndex };
        }
    }]);

    return IfStatementParser;
}();

exports.default = IfStatementParser;