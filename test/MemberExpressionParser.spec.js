import MemberExpressionParser from "../src/MemberExpressionParser";
import assert from "assert";

describe( "Parse Member Expression", () => {
    let memberExpressionParser;

    beforeEach( () => {
        memberExpressionParser = new MemberExpressionParser();
    } );

    it( "should parse member expression with name and property", () => {
        let declarations = { "conditionConcept": "Concept 1" },
            data = { "type": "MemberExpression", "object": { "type": "Identifier", "name": "conditionConcept" },
                "property": { "type": "Identifier", "name": "length" } };

        assert.equal( memberExpressionParser.parse( data, declarations ), "Concept 1 with length" );
    } );

    it( "should parse member expression with just name when property is undefined", () => {
        let declarations = { "conditionConcept": "Concept 1" },
            data = { "type": "MemberExpression", "object": { "type": "Identifier", "name": "conditionConcept" } };

        assert.equal( memberExpressionParser.parse( data, declarations ), "Concept 1 with " );
    } );

    it( "should parse member expression property as indexOf", () => {
        let declarations = { "conditionConcept": "Concept 1" },
            data = { "type": "MemberExpression", "object": { "type": "Identifier", "name": "conditionConcept" },
                "property": { "type": "Identifier", "name": "indexOf" } };

        assert.equal( memberExpressionParser.parse( data, declarations ), "Concept 1 contains" );
    } );

    it( "should parse member expression property as includes", () => {
        let declarations = { "conditionConcept": "Concept 1" },
            data = { "type": "MemberExpression", "object": { "type": "Identifier", "name": "conditionConcept" },
                "property": { "type": "Identifier", "name": "includes" } };

        assert.equal( memberExpressionParser.parse( data, declarations ), "Concept 1 contains" );
    } );
} );
