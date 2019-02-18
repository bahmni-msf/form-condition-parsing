import { getParser } from "./ParserFactory";

class BinaryExpressionParser {
    parse( data, declarations ) {
        let stringValue = "", leftValue, rightValue = "";

        leftValue = getParser( data.left.type ).parse( data.left, declarations );
       
        if (data.left.type !== "CallExpression") {
            rightValue = getParser(data.right.type).parse(data.right, declarations);
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
                case "!=" :
                case "!==":
                    stringValue = "is not equal to";
                    break;
                default:
                    stringValue = "";
            }
        } else if (data.right) {
            const rightValueCondition = getParser(data.right.type).parse(data.right, declarations);
            const finalConditon = `${data.operator} ${rightValueCondition}`;

            switch (finalConditon) {
                case "< 0":
                case "== -1": leftValue = leftValue.replace("contains", "does not contains");
                    break;
                default: break;
            }
        }

        return stringValue === "" ? `${leftValue} ${rightValue}` :
            `${leftValue} ${stringValue} ${rightValue}`;
    }
}

export default BinaryExpressionParser;

