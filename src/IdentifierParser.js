class IdentifierParser {
    parse( data, declarations ) {
        let value = declarations[ data.name ];

        return value;
    }
}
export default IdentifierParser;

