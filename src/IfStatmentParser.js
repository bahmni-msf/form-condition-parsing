import { getParser } from "./ParserFactory";

let estraverse = require( "estraverse" );

class IfStatementParser {
    constructor() {
        this.parse = this.parse.bind( this );
        this.parseBlock = this.parseBlock.bind( this );
    }

    parseBlock( tree, declarations ) {
        let conceptsToHide = [],
            conceptsToShow = [],
            nestedConditions = [];

        estraverse.traverse( tree, {
            "enter": ( node, parent ) => {
                if ( node.type === "MemberExpression" && node.object && node.object.type === "MemberExpression" ) {
                    if ( node.object.property.name === "hide" || node.object.property.name === "disable" ) {
                        parent.arguments.forEach( ( argument ) => conceptsToHide.push( argument.value ) );
                    } else if ( node.object.property.name === "show" || node.object.property.name === "enable" ) {
                        parent.arguments.forEach( ( argument ) => conceptsToShow.push( argument.value ) );
                    }
                } else if ( node.type === "IfStatement" ) {
                    nestedConditions.push( this.parse( node, declarations ) );
                    return estraverse.VisitorOption.Skip;
                }
            }
        } );
        return { conceptsToHide, conceptsToShow, nestedConditions };
    }

    parse( data, declarations ) {
        const stringValue = "if selected answers for ",
            testCondition = getParser( data.test.type ).parse( data.test, declarations ),
            condition = stringValue + testCondition,
            { conceptsToHide, conceptsToShow, nestedConditions } = this.parseBlock( data.consequent, declarations );

        return { condition, conceptsToHide, conceptsToShow, nestedConditions };
    }
}

export default IfStatementParser;

