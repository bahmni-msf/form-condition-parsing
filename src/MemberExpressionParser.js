class MemberExpressionParser{
    parse(data,declarations){
       let value= declarations[data.object.name]
       let property= data.property? data.property.name: "";
       return value + " with " + property;
    }
}
export default MemberExpressionParser;

