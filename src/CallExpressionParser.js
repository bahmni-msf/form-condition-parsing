import { getParser } from "./ParserFactory";

class CallExpressionParser {

    parse( data, declarations ) {
        let calleeValue = getParser( data.callee.type ).parse( data.callee, declarations );
        let argumentValues = "";
        let counter = 0;
        const noOfArguments = data.arguments.length;

        data.arguments.forEach((argument) => {
            counter++;
            argumentValues = `${argumentValues} ${getParser(argument.type)
                .parse(argument, declarations)}`;
            if (counter < noOfArguments) {
                argumentValues = `${argumentValues} &`;
            }

        });

        return `${calleeValue}${argumentValues}`;
    }
}

export default CallExpressionParser;
