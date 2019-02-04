import BinaryExpressionParser from './BinaryExpressionParser';
import MemberExpressionParser from './MemberExpressionParser';
import IfStatmentParser from './IfStatmentParser';
import LiteralPraser from "./LiteralPraser";
import IdentifierParser from './IdentifierParser';
export function getParser(type){
    switch(type){
        case 'BinaryExpression' : return new BinaryExpressionParser();
        case 'MemberExpression' : return new MemberExpressionParser();
        case 'IfStatement' : return new IfStatmentParser();
        case 'Literal' : return new LiteralPraser();
        case 'Identifier' : return new IdentifierParser();
        default: return null;
    }
}