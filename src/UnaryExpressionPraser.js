import LiteralParser from "./LiteralParser"
class UnaryExpressionParser {
    parse( data ) {
        return new LiteralParser().parse(data.argument)
    }
}

export default UnaryExpressionParser;
