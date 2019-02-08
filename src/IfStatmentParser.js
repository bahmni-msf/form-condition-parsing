import { getParser } from "./ParserFactory";

let estraverse = require( "estraverse" );

class IfStatementParser {

    parseBlock( tree ) {
        let conceptsToHide = [], conceptsToShow = [];

        estraverse.traverse( tree, {
            "enter": function( node, parent ) {
                if ( node.type === "MemberExpression" && node.object && node.object.type === "MemberExpression" ) {
                    if ( node.object.property.name === "hide" || node.object.property.name === "disable" ) {
                        parent.arguments.forEach( ( argument ) => conceptsToHide.push( argument.value ) );
                    } else if ( node.object.property.name === "show" || node.object.property.name === "enable" ) {
                        parent.arguments.forEach( ( argument ) => conceptsToShow.push( argument.value ) );
                    }
                }
            }
        } );
        return { conceptsToHide, conceptsToShow };
    }

    parse( data, declarations ) {
        let stringValue = "if selected answers for ",
            testCondition = getParser( data.test.type ).parse( data.test, declarations ),
            condition = stringValue + testCondition,
            { conceptsToHide, conceptsToShow } = this.parseBlock( data.consequent ),
            nestedConditions;

        return { condition, conceptsToHide, conceptsToShow, nestedConditions };
    }
}

export default IfStatementParser;

