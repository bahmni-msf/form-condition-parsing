import BinaryExpressionParser from "./BinaryExpressionParser";
import MemberExpressionParser from "./MemberExpressionParser";
import IfStatmentParser from "./IfStatmentParser";
import LiteralPraser from "./LiteralParser";
import IdentifierParser from "./IdentifierParser";
import LogicalExpressionParser from "./LogicalExpressionParser";
import CallExpressionParser from "./CallExpressionParser";
import UnaryExpressionParser from "./UnaryExpressionPraser";
export function getParser( type ) {
    switch ( type ) {
        case "BinaryExpression" : return new BinaryExpressionParser();
        case "LogicalExpression" : return new LogicalExpressionParser();
        case "MemberExpression" : return new MemberExpressionParser();
        case "IfStatement" : return new IfStatmentParser();
        case "Literal" : return new LiteralPraser();
        case "Identifier" : return new IdentifierParser();
        case "CallExpression" : return new CallExpressionParser();
        case "UnaryExpression" : return new UnaryExpressionParser();
        default: return null;
    }
}
