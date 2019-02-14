import IfStatmentParser from "./IfStatmentParser";
import Stack from "./stack";

let esprima = require( "esprima" ),
    estraverse = require( "estraverse" );

function createAst( content ) {
    try {
        return esprima.parse( content, { "loc": true } );
    } catch ( e ) {
        console.error( e.message );
        return "";
    }
}

function parseVariableDeclaration( node, declarations ) {
    const initOfDeclarations= node.declarations[ 0 ].init;
    if (initOfDeclarations ) {
        if(initOfDeclarations.property)
            declarations[ node.declarations[ 0 ].id.name ] = node.declarations[ 0 ].init.property.value;
        else if(initOfDeclarations.value){
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
            && bodyElement.expression.left.property.name === "rules" );

    filteredAst[ 0 ].expression.right.properties.forEach( ( concept ) => {
        let currentConceptName, parsedDataList = [];
        let stackOfIfNodes = new Stack();

        estraverse.traverse( concept, {
            "enter": function( node ) {
                currentConceptName = concept.key.value;
                if ( node.type === "VariableDeclaration" ) {
                    parseVariableDeclaration( node, declarations );
                }
                if (node.type === "IfStatement" ) {
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
        } );
        finalParsedTree[ currentConceptName ] = parsedDataList;
    } );
    return finalParsedTree;
}
