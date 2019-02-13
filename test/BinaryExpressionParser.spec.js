import BinaryExpressionParser from "../src/BinaryExpressionParser";
import assert from "assert";
import CallExpressionParser from "../src/CallExpressionParser";
import LiteralParser from "../src/LiteralParser";
import sinon from "sinon";
import * as ParserFactory from "../src/ParserFactory";
import MemberExpressionParser from "../src/MemberExpressionParser";

describe("Parse form Binary Expression", () => {
    let binaryExpressionParser, parserFactoryStub, data;

    beforeEach(() => {
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
        parserFactoryStub = sinon.stub(ParserFactory, "getParser");
    });

    afterEach(() => parserFactoryStub.restore());

    it("should parse binary expression for operator >=", () => {
        data.operator = ">=";
        let declarations = { "conditionConcept": "Concept 1" },

            expected = "Concept 1 with length greater than or equal to 2";

        parserFactoryStub.onCall(0).returns(new MemberExpressionParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        assert.equal(binaryExpressionParser.parse(data, declarations), expected);
    });

    it("should parse binary expression for operator ==", () => {
        data.operator = "==";
        let declarations = { "conditionConcept": "Concept 1" },

            expected = "Concept 1 with length is equal to 2";

        parserFactoryStub.onCall(0).returns(new MemberExpressionParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        assert.equal(binaryExpressionParser.parse(data, declarations), expected);
    });

    it("should parse binary expression for operator ===", () => {
        data.operator = "===";
        let declarations = { "conditionConcept": "Concept 1" },

            expected = "Concept 1 with length is equal to 2";

        parserFactoryStub.onCall(0).returns(new MemberExpressionParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        assert.equal(binaryExpressionParser.parse(data, declarations), expected);
    });

    it("should parse binary expression for no operator", () => {
        let declarations = { "conditionConcept": "Concept 1" },
            expected = "Concept 1 with length 2";

        parserFactoryStub.onCall(0).returns(new MemberExpressionParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        assert.equal(binaryExpressionParser.parse(data, declarations), expected);
    });

    it("should parse binary expression with operator == & right value as 0 when the left side is a " +
        "call expression", () => {
        let declarations = { "conditionConcept": "Concept 1" };
        const content = {
            "type": "BinaryExpression",
            "operator": "==",
            "left": {
                "type": "CallExpression",
                "callee": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "conditionConcept"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "indexOf"
                    }
                },
                "arguments": [
                    {
                        "type": "Literal",
                        "value": "Other"
                    }
                ]
            },
            "right": {
                "type": "Literal",
                "value": 0
            }
        };
        const callExpressionParserStub = sinon.stub(CallExpressionParser.prototype, "parse")
            .returns("Concept 1 contains Other");
        const literalParserStub = sinon.stub(LiteralParser.prototype, "parse")
            .returns("0");

        parserFactoryStub.onCall(0).returns(new CallExpressionParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        const expected = "Concept 1 contains Other ";

        assert.equal(binaryExpressionParser.parse(content, declarations), expected);
        callExpressionParserStub.restore();
        literalParserStub.restore();
    });

    it("should parse binary expression with operator >= & right value as 0 when the left side is a call expression",
        () => {
            let declarations = { "conditionConcept": "Concept 1" };
            const content = {
                "type": "BinaryExpression",
                "operator": ">=",
                "left": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "conditionConcept"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "indexOf"
                        }
                    },
                    "arguments": [
                        {
                            "type": "Literal",
                            "value": "Other"
                        }
                    ]
                },
                "right": {
                    "type": "Literal",
                    "value": 0
                }
            };
            const callExpressionParserStub = sinon.stub(CallExpressionParser.prototype, "parse")
                .returns("Concept 1 contains Other");
            const literalParserStub = sinon.stub(LiteralParser.prototype, "parse")
                .returns("0");

            parserFactoryStub.onCall(0).returns(new CallExpressionParser());
            parserFactoryStub.onCall(1).returns(new LiteralParser());
            const expected = "Concept 1 contains Other ";

            assert.equal(binaryExpressionParser.parse(content, declarations), expected);
            callExpressionParserStub.restore();
            literalParserStub.restore();
        });

    it("should parse binary expression with operator < & right value as 0 when the left side is a call expression",
        () => {
            let declarations = { "conditionConcept": "Concept 1" };
            const content = {
                "type": "BinaryExpression",
                "operator": "<",
                "left": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "conditionConcept"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "indexOf"
                        }
                    },
                    "arguments": [
                        {
                            "type": "Literal",
                            "value": "Other"
                        }
                    ]
                },
                "right": {
                    "type": "Literal",
                    "value": 0
                }
            };
            const callExpressionParserStub = sinon.stub(CallExpressionParser.prototype, "parse")
                .returns("Concept 1 contains Other");
            const literalParserStub = sinon.stub(LiteralParser.prototype, "parse")
                .returns("0");

            parserFactoryStub.onCall(0).returns(new CallExpressionParser());
            parserFactoryStub.onCall(1).returns(new LiteralParser());
            const expected = "Concept 1 does not contains Other ";

            assert.equal(binaryExpressionParser.parse(content, declarations), expected);
            callExpressionParserStub.restore();
            literalParserStub.restore();
        });

    it("should parse binary expression with operator == & right value as -1 when the left side is a call expression",
        () => {
            let declarations = { "conditionConcept": "Concept 1" };
            const content = {
                "type": "BinaryExpression",
                "operator": "==",
                "left": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "conditionConcept"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "indexOf"
                        }
                    },
                    "arguments": [
                        {
                            "type": "Literal",
                            "value": "Other"
                        }
                    ]
                },
                "right": {
                    "type": "Literal",
                    "value": -1
                }
            };
            const callExpressionParserStub = sinon.stub(CallExpressionParser.prototype, "parse")
                .returns("Concept 1 contains Other");
            const literalParserStub = sinon.stub(LiteralParser.prototype, "parse")
                .returns("-1");

            parserFactoryStub.onCall(0).returns(new CallExpressionParser());
            parserFactoryStub.onCall(1).returns(new LiteralParser());
            const expected = "Concept 1 does not contains Other ";

            assert.equal(binaryExpressionParser.parse(content, declarations), expected);
            callExpressionParserStub.restore();
            literalParserStub.restore();
        });
});
