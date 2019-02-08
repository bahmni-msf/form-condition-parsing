import LiteralParser from "../src/LiteralParser";
import assert from "assert";

describe( "Parse Literals", () => {
    let literalParser;

    beforeEach( () => {
        literalParser = new LiteralParser();
    } );

    it( "should return literal value ", () => {
        let data = {
            "type": "Literal",
            "value": 2
        };

        assert.equal( literalParser.parse( data, {} ), "2" );
    } );
} );
