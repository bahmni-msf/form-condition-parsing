import {getParser} from './ParserFactory';

class BinaryExpressionParser{
    parse(data,declarations){
        let stringValue;
        switch(data.operator){
            case '>=' : stringValue = 'greater than and equal to';
                        break;
            case '==' : stringValue='is equal to'
        }

        let leftValue =  getParser(data.left.type).parse(data.left,declarations);
        let rightValue =  getParser(data.right.type).parse(data.right,declarations);
        return leftValue+ " " + stringValue + " " + rightValue;
    }
}
export default BinaryExpressionParser;

