import LiteralParser from "./LiteralParser";
class UnaryExpressionParser {
    parse( data, declarations ) {
        return new LiteralParser().parse(data.argument, declarations);
    }
}

export default UnaryExpressionParser;
