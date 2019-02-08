import BinaryExpressionParser from "../src/BinaryExpressionParser";
import assert from "assert";

describe( "Parse form Binary Expression", () => {
    let binaryExpressionParser,
        data;

    beforeEach( () => {
        data = {
            "type": "BinaryExpression",
            "left": {
                "type": "MemberExpression",
                "object": {
                    "type": "Identifier",
                    "name": "conditionConcept"
                },
                "property": {
                    "type": "Identifier",
                    "name": "length"
                }
            },
            "right": {
                "type": "Literal",
                "value": 2
            }
        };
        binaryExpressionParser = new BinaryExpressionParser();
    } );

    it( "should parse binary expression for operator >=", () => {
        data.operator = ">=";
        let declarations = { "conditionConcept": "Concept 1" },

            expected = "Concept 1 with length greater than or equal to 2";

        assert.equal( binaryExpressionParser.parse( data, declarations ), expected );
    } );

    it( "should parse binary expression for operator ==", () => {
        data.operator = "==";
        let declarations = { "conditionConcept": "Concept 1" },

            expected = "Concept 1 with length is equal to 2";

        assert.equal( binaryExpressionParser.parse( data, declarations ), expected );
    } );

    it( "should parse binary expression for operator ===", () => {
        data.operator = "===";
        let declarations = { "conditionConcept": "Concept 1" },

            expected = "Concept 1 with length is equal to 2";

        assert.equal( binaryExpressionParser.parse( data, declarations ), expected );
    } );

    it( "should parse binary expression for no operator", () => {
        let declarations = { "conditionConcept": "Concept 1" },

            expected = "Concept 1 with length 2";

        assert.equal( binaryExpressionParser.parse( data, declarations ), expected );
    } );
} );
