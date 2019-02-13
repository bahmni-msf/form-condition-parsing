import { getParser } from "./ParserFactory";

class BinaryExpressionParser {
    parse( data, declarations ) {
        let stringValue = "", leftValue, rightValue = "";

        leftValue = getParser( data.left.type ).parse( data.left, declarations );
        if (data.left.type !== "CallExpression") {
            rightValue = getParser(data.right.type)
                .parse(data.right, declarations);
            switch (data.operator) {
                case ">=":
                    stringValue = "greater than or equal to";
                    break;
                case "<=":
                    stringValue = "less than or equal to";
                    break;
                case ">":
                    stringValue = "greater than";
                    break;
                case "<":
                    stringValue = "less than";
                    break;
                case "==":
                case "===":
                    stringValue = "is equal to";
                    break;
                default:
                    stringValue = "";
            }
        }

        return stringValue === "" ? `${leftValue} ${rightValue}` :
            `${leftValue} ${stringValue} ${rightValue}`;
    }
}

export default BinaryExpressionParser;

