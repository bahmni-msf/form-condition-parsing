class MemberExpressionParser {
    parse( data, declarations ) {
        let value = declarations[ data.object.name ],
            property = data.property ? data.property.name : "";

        switch (property) {
            case "indexOf" :
            case "includes" : property = "contains";
                break;
            default : property = `with ${property}`;
        }

        return `${value } ${property}`;
    }
}

export default MemberExpressionParser;

