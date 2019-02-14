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

        estraverse.traverse(data, {
            "enter": (node) => {
                if ( node.type === "IfStatement" ) {
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
                if (node.type === "IfStatement") {
                    this.parseIfStatementBlocks(nodeStack, node, declarations, parsedNodes);
                }
            }
        });
        return parsedNodes;
    }


    parseIfStatementBlocks(nodeStack, node, declarations, parsedNodes) {
        let currentNode = nodeStack.pop();
        const stringValue = "if selected answers for ";
        const testCondition = getParser(node.test.type).parse(node.test, declarations);
        const condition = `${stringValue}${testCondition}`;

        currentNode.condition = condition;

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

        let { rootIfParent, rootIfParentIndex } = this.findRootIfParentForAlternate(nodeStack, node);

        if (rootIfParentIndex > 1) {
            let parentNode = rootIfParent;

            if (parentNode) {
                this.addAsNestedConditionToParent(parentNode, "", {
                    conceptsToHide,
                    conceptsToShow
                });
            } else {
                this.addToRootLevelConditions(parsedNodes, "", {
                    conceptsToHide,
                    conceptsToShow
                });
            }
        } else {
            currentNode.conceptsToHide = currentNode.conceptsToHide.concat(conceptsToHide);
            currentNode.conceptsToShow = currentNode.conceptsToShow.concat(conceptsToShow);
        }
    }

    parseMemeberExpressionConcepts(node, parent, conceptsToHide, conceptsToShow) {
        if (node.object.property.name === "hide" || node.object.property.name === "disable") {
            parent.arguments.forEach((argument) => conceptsToHide.push(argument.value));
        } else if (node.object.property.name === "show" || node.object.property.name === "enable") {
            parent.arguments.forEach((argument) => conceptsToShow.push(argument.value));
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

