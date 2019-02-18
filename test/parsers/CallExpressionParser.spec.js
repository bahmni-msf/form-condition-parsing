import CallExpressionParser from "../../src/parsers/CallExpressionParser";
import MemberExpressionParser from "../../src/parsers/MemberExpressionParser";
import LiteralParser from "../../src/parsers/LiteralParser";
import assert from "assert";
import sinon from "sinon";
import * as ParserFactory from "../../src/parsers/ParserFactory";

describe( "Parse Call Expression", () => {
    let callExpressionParser;
    let parserFactoryStub;
    const declarations = { "conditionConcept": "Concept 1" };

    beforeEach( () => {
        callExpressionParser = new CallExpressionParser();
        parserFactoryStub = sinon.stub( ParserFactory, "getParser" );
    } );

    afterEach( () => parserFactoryStub.restore() );

    it( "should be able to parse a callexpression with one argument", () => {
        let data = {
            "callee": {
                "type": "MemberExpression",
                "object": {
                    "type": "Identifier",
                    "name": "conditionConcept"
                },
                "property": {
                    "type": "Identifier",
                    "name": "includes"
                }
            },
            "arguments": [
                {
                    "type": "Literal",
                    "value": "Site, Other",
                    "raw": "\"Site, Other\""
                }
            ]
        };

        parserFactoryStub.onCall(0).returns( new MemberExpressionParser() );
        parserFactoryStub.onCall(1).returns( new LiteralParser() );

        const memberExpressionParserStub = sinon.stub( MemberExpressionParser.prototype, "parse" )
            .returns( "Concept 1 contains" );
        const literalParserStub = sinon.stub(LiteralParser.prototype, "parse").returns("Site, Other");
        let parsedResult = callExpressionParser.parse(data, declarations);

        assert.equal(parsedResult, "Concept 1 contains Site, Other");
        memberExpressionParserStub.restore();
        literalParserStub.restore();

    } );

    it( "should be able to parse a callexpression with multiple arguments", () => {
        let data = {
            "callee": {
                "type": "MemberExpression",
                "object": {
                    "type": "Identifier",
                    "name": "conditionConcept"
                },
                "property": {
                    "type": "Identifier",
                    "name": "includes"
                }
            },
            "arguments": [
                {
                    "type": "Literal",
                    "value": "Site, Other"
                },
                {
                    "type": "Literal",
                    "value": "Argument 1"
                },
                {
                    "type": "Literal",
                    "value": "Argument 2"
                }
            ]
        };

        parserFactoryStub.onCall(0).returns( new MemberExpressionParser() );
        parserFactoryStub.onCall(1).returns( new LiteralParser() );
        parserFactoryStub.onCall(2).returns( new LiteralParser() );
        parserFactoryStub.onCall(3).returns( new LiteralParser() );

        const memberExpressionParserStub = sinon.stub( MemberExpressionParser.prototype, "parse" )
            .returns( "Concept 1 contains" );
        const literalParserStub = sinon.stub(LiteralParser.prototype, "parse");

        literalParserStub.onCall(0).returns("Site, Other");
        literalParserStub.onCall(1).returns("Argument 1");
        literalParserStub.onCall(2).returns("Argument 2");
        let parsedResult = callExpressionParser.parse(data, declarations);

        assert.equal(parsedResult, "Concept 1 contains Site, Other & Argument 1 & Argument 2");
        memberExpressionParserStub.restore();
        literalParserStub.restore();

    } );
} );
