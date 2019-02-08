import { getParser } from "./ParserFactory";

class BinaryExpressionParser {
    parse( data, declarations ) {
        let stringValue, leftValue, rightValue;

        switch ( data.operator ) {
            case ">=" :
                stringValue = "greater than or equal to";
                break;
            case "==" :
            case "===" :
                stringValue = "is equal to";
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

export default BinaryExpressionParser;

