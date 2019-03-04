import IfStatmentParser from "./IfStatmentParser";
import Stack from "../util/stack";
import Logger from "../util/logger";

let esprima = require( "esprima" ),
    estraverse = require( "estraverse" );

function createAst( content ) {
    try {
        return esprima.parse( content, { "loc": true } );
    } catch ( e ) {
        Logger.error(e.message);
        return "";
    }
}

function parseVariableDeclaration( node, declarations ) {
    const initOfDeclarations = node.declarations[ 0 ].init;

    if (initOfDeclarations ) {
        if (initOfDeclarations.property) {
            declarations[ node.declarations[ 0 ].id.name ] = node.declarations[ 0 ].init.property.value;
        } else if (initOfDeclarations.value) {
            declarations[ node.declarations[ 0 ].id.name ] = initOfDeclarations.value;
        }
    }
}

export function parseContent( content ) {
    let ast = createAst( content ),
        finalParsedTree = {},
        declarations = {},
        filteredAst = ast.body.filter( ( bodyElement ) => bodyElement.type === "ExpressionStatement"
            && bodyElement.expression.type === "AssignmentExpression"
            && (bodyElement.expression.left.property.name === "rules"
                || bodyElement.expression.left.property.name === "rulesOverride"));

    filteredAst[ 0 ].expression.right.properties.forEach( ( concept ) => {
        let currentConceptName = "";
        let parsedDataList = [];
        let stackOfIfNodes = new Stack();

        try {
            estraverse.traverse(concept, {
                "enter": function(node) {
                    currentConceptName = concept.key.value;
                    if (node.type === "VariableDeclaration") {
                        parseVariableDeclaration(node, declarations);
                    }
                    if (node.type === "IfStatement") {
                        if (stackOfIfNodes.isEmpty()) {
                            let parsedIfNode = new IfStatmentParser().parse(node, declarations);

                            parsedDataList = parsedDataList.concat(parsedIfNode);
                        }
                        stackOfIfNodes.push(node);
                    }
                },
                "leave": function(node) {
                    if (node.type === "IfStatement") {
                        stackOfIfNodes.pop(node);
                    }
                }
            });
            finalParsedTree[ currentConceptName ] = parsedDataList;
            if (parsedDataList.length === 0) {
                Logger.warn(`"${currentConceptName}" returned empty value.`);
            }
        } catch (exception) {
            Logger.error(`"${currentConceptName}" did not parse. Error : ${exception.stack}`);
        }
    } );
    return finalParsedTree;
}
