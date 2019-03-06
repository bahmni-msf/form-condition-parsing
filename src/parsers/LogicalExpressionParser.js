import { getParser } from "./ParserFactory";

class LogicalExpressionParser {
    parse( data, declarations ) {
        let stringValue, leftValue, rightValue;

        switch ( data.operator ) {
            case "||" :
                stringValue = "or ";
                break;
            case "&&" :
                stringValue = "and ";
                break;
            default :
                stringValue = "";
        }

        leftValue = getParser( data.left.type ).parse( data.left, declarations );
        rightValue = getParser( data.right.type ).parse( data.right, declarations );
        return stringValue === "" ? `${leftValue} ${rightValue}` :
            `${leftValue} ${stringValue} ${rightValue}`;
    }
}

export default LogicalExpressionParser;
