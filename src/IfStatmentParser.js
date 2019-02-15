import { getParser } from "./ParserFactory";
import Stack from "./stack";

let estraverse = require( "estraverse" );

class IfStatementParser {
    constructor() {
        this.parse = this.parse.bind( this );
    }

    parse( data, declarations) {
        let nodeStack = new Stack();
        let parsedNodes = [];

        this.declarations = declarations;

        estraverse.traverse(data, {
            "enter": (node, parent) => {
                if ( node.type === "IfStatement" || (parent && node.type === "BlockStatement"
                        && parent.alternate === node) ) {
                    node.nestedConditions = [];
                    node.conceptsToHide = [];
                    node.conceptsToShow = [];
                    nodeStack.push(node);
                }
            },
            "leave": (node, parent) => {
                if ( node.type === "MemberExpression" && node.object && node.object.type === "MemberExpression" ) {
                    this.parseMemberExpressionBlocks(nodeStack, node, parent, parsedNodes);
                }
                if (node.type === "IfStatement" || (parent && node.type === "BlockStatement"
                        && parent.alternate === node)) {
                    this.parseIfStatementBlocks(nodeStack, node, declarations, parsedNodes);
                }
                if ( node.type === "ReturnStatement" && node.argument.type === "ObjectExpression") {
                    let currentNode = nodeStack.peek();
                    let conceptsToHide = [], conceptsToShow = [];

                    node.argument.properties.forEach((property) => {
                        if (property.key.name === "enable" || property.key.name === "show") {
                            property.value.elements.forEach((element) => conceptsToShow.push(
                                getParser(element.type).parse(element, this.declarations)
                            ));
                        } else if (property.key.name === "disable" || property.key.name === "hide") {
                            property.value.elements.forEach((element) => conceptsToHide.push(
                                getParser(element.type).parse(element, this.declarations)
                            ));
                        }
                    });

                    this.addParsedNodesToTree(nodeStack, node, conceptsToHide, conceptsToShow,
                        parsedNodes, currentNode);
                }
            }
        });
        return parsedNodes;
    }


    parseIfStatementBlocks(nodeStack, node, declarations, parsedNodes) {
        let currentNode = nodeStack.pop();
        const stringValue = "if selected answers for ";
        let condition;

        if (node.type !== "BlockStatement") {
            const testCondition = getParser(node.test.type).parse(node.test, declarations);

            condition = `${stringValue}${testCondition}`;

            currentNode.condition = condition;
        } else {
            currentNode.condition = "";
            condition = "";
        }

        let parentNode = nodeStack.peek();

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

    addToRootLevelConditions(parsedNodes, condition, currentNode) {
        parsedNodes.push({
            condition,
            conceptsToHide: currentNode.conceptsToHide,
            conceptsToShow: currentNode.conceptsToShow,
            nestedConditions: currentNode.nestedConditions
        });
    }

    addAsNestedConditionToParent(parentNode, condition, currentNode) {
        parentNode.nestedConditions.push({
            condition,
            conceptsToHide: currentNode.conceptsToHide,
            conceptsToShow: currentNode.conceptsToShow,
            nestedConditions: currentNode.nestedConditions
        });
    }

    parseAlternateIfBlock(nodeStack, node, condition, currentNode, parsedNodes) {
        let { rootIfParent } = this.findRootIfParentForAlternate(nodeStack, node);

        if (rootIfParent) {
            this.addAsNestedConditionToParent(rootIfParent, condition, currentNode);
        } else {
            this.addToRootLevelConditions(parsedNodes, condition, currentNode);
        }
    }

    parseMemberExpressionBlocks(nodeStack, node, parent, parsedNodes) {
        let currentNode = nodeStack.peek();
        let conceptsToHide = [], conceptsToShow = [];

        this.parseMemeberExpressionConcepts(node, parent, conceptsToHide, conceptsToShow);
        this.addParsedNodesToTree(nodeStack, node, conceptsToHide, conceptsToShow, parsedNodes, currentNode);
    }

    addParsedNodesToTree(nodeStack, node, conceptsToHide, conceptsToShow, parsedNodes, currentNode) {
        let { rootIfParent, rootIfParentIndex } = this.findRootIfParentForAlternate(nodeStack, node);

        if (rootIfParentIndex > 1) {
            let parentNode = rootIfParent;

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

    parseMemeberExpressionConcepts(node, parent, conceptsToHide, conceptsToShow) {
        if (node.object.property.name === "hide" || node.object.property.name === "disable") {
            parent.arguments.forEach((argument) => {
                conceptsToHide.push(getParser(argument.type).parse(argument, this.declarations));
            });
        } else if (node.object.property.name === "show" || node.object.property.name === "enable") {
            parent.arguments.forEach((argument) => {
                conceptsToShow.push(getParser(argument.type).parse(argument, this.declarations));
            });
        }
    }

    findRootIfParentForAlternate(nodeStack, node) {
        let rootIfParent = nodeStack.peek();
        let rootIfParentIndex = 1;

        while (rootIfParentIndex <= nodeStack.size() && rootIfParent.alternate
        && JSON.stringify(rootIfParent.alternate).includes(JSON.stringify(node))) {
            rootIfParent = nodeStack.peekToLevel(++rootIfParentIndex);
        }
        return { rootIfParent, rootIfParentIndex };
    }
}

export default IfStatementParser;

