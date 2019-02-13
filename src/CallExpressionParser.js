import { getParser } from "./ParserFactory";

class CallExpressionParser {
    parse( data, declarations ) {
        let calleeValue = getParser( data.callee.type ).parse( data.callee, declarations );
        let argumentValues = "";

        data.arguments.forEach((argument) => {
            argumentValues = `${argumentValues} ${getParser(argument.type)
                .parse(argument, declarations)}`;
        });

        return `${calleeValue}${argumentValues}`;
    }
}

export default CallExpressionParser;
