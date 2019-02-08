import IfStatementParser from "../src/IfStatmentParser";
import assert from "assert";
import sinon from "sinon";
import * as ParserFactory from "../src/ParserFactory";
import BinaryExpressionParser from "../src/BinaryExpressionParser";

describe( "Parse Block Statements inside if statements", () => {
    let ifStatementParser,
        tree;
   

    beforeEach( () => {
        ifStatementParser = new IfStatementParser();
        tree = {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "MemberExpression",
                    "object": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "Identifier",
                            "name": "conditions"
                        },
                        "property": {
                            "type": "Identifier"
                        }
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "push"
                    }
                },
                "arguments": [
                    {
                        "type": "Literal",
                        "value": "ConceptA"
                    }
                ]
            }
        };
      
    } );

    it( "should parse tree and return conceptsToHide for property hide", () => {
        tree.expression.callee.object.property.name = "hide";

        let conceptsToHide = "ConceptA";

        assert.equal( ifStatementParser.parseBlock( tree ).conceptsToHide[ 0 ], conceptsToHide );
    } );

    it( "should parse tree and return conceptsToShow for property show", () => {
        tree.expression.callee.object.property.name = "show";

        let conceptsToShow = "ConceptA";

        assert.equal( ifStatementParser.parseBlock( tree ).conceptsToShow[ 0 ], conceptsToShow );
    } );

    it( "should parse tree and return conceptsToShow for property enable", () => {
        tree.expression.callee.object.property.name = "enable";

        let conceptsToShow = "ConceptA";

        assert.equal( ifStatementParser.parseBlock( tree ).conceptsToShow[ 0 ], conceptsToShow );
    } );

    it( "should parse tree and return conceptsToShow for property disable", () => {
        tree.expression.callee.object.property.name = "disable";

        let conceptsToHide = "ConceptA";

        assert.equal( ifStatementParser.parseBlock( tree ).conceptsToHide[ 0 ], conceptsToHide );
    } );
} );
describe( "parse If Statements", () => {
    let ifStatementParser,
        parserFactoryStub;

    beforeEach( () => {
        ifStatementParser = new IfStatementParser();
        parserFactoryStub = sinon.stub( ParserFactory, "getParser" );
    } );
    afterEach( () => parserFactoryStub.restore() );

    it( "should parse single if condition", () => {
        let data = {
                "type": "IfStatement",
                "test": {
                    "type": "BinaryExpression",
                    "operator": ">=",
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
                        "value": 2,
                        "raw": "2"
                    }
                },
                "consequent": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "MemberExpression",
                                    "object": {
                                        "type": "MemberExpression",
                                        "object": {
                                            "type": "Identifier",
                                            "name": "conditions"
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "hide"
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "push"
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "ConceptA"
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            declarations = { "conditionConcept": "Concept 1" },
            condition = "if selected answers for Concept 1 with length greater than or equal to 2",
            conceptsToHide = "ConceptA";
            
        const binaryExpressionParserStub = sinon.stub( BinaryExpressionParser.prototype, "parse" )
            .returns( "Concept 1 with length greater than or equal to 2" );

        parserFactoryStub.returns( new BinaryExpressionParser() );

        assert.equal( ifStatementParser.parse( data, declarations ).condition, condition );
        assert.equal( ifStatementParser.parse( data, declarations ).conceptsToHide[ 0 ], conceptsToHide );
        binaryExpressionParserStub.restore();
    } );

    it( "should parse nested if conditions", () => {
        let data = {
                "type": "IfStatement",
                "test": {
                    "type": "BinaryExpression",
                    "operator": ">=",
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
                },
                "consequent": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "MemberExpression",
                                        "computed": false,
                                        "object": {
                                            "type": "Identifier",
                                            "name": "conditions"
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "hide"
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "push"
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "ConceptA",
                                        "raw": "\"ConceptA\""
                                    }
                                ]
                            }
                        },
                        {
                            "type": "IfStatement",
                            "test": {
                                "type": "BinaryExpression",
                                "operator": ">=",
                                "left": {
                                    "type": "MemberExpression",
                                    "computed": false,
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
                                    "value": 4,
                                    "raw": "4"
                                }
                            },
                            "consequent": {
                                "type": "BlockStatement",
                                "body": [
                                    {
                                        "type": "ExpressionStatement",
                                        "expression": {
                                            "type": "CallExpression",
                                            "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                    "type": "MemberExpression",
                                                    "computed": false,
                                                    "object": {
                                                        "type": "Identifier",
                                                        "name": "conditions"
                                                    },
                                                    "property": {
                                                        "type": "Identifier",
                                                        "name": "hide"
                                                    }
                                                },
                                                "property": {
                                                    "type": "Identifier",
                                                    "name": "push"
                                                }
                                            },
                                            "arguments": [
                                                {
                                                    "type": "Literal",
                                                    "value": "ConceptX",
                                                    "raw": "\"ConceptX\""
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            declarations = { "conditionConcept": "Concept 1" },

            condition = "if selected answers for Concept 1 with length greater than or equal to 4",
            conceptsToHide = "ConceptX",
            binaryExpressionParserStub = sinon.stub( BinaryExpressionParser.prototype, "parse" );

        binaryExpressionParserStub.onCall( 0 ).returns( "Concept 1 with length greater than or equal to 2" );
        binaryExpressionParserStub.onCall( 1 ).returns( "Concept 1 with length greater than or equal to 4" );
        parserFactoryStub.returns( new BinaryExpressionParser() );
      
        const parsedResult = ifStatementParser.parse( data, declarations ),
            actualNestedConditions = parsedResult.nestedConditions;

        assert.equal( actualNestedConditions.length, 1 );
        assert.equal( actualNestedConditions[ 0 ].conceptsToHide, conceptsToHide );
        assert.equal( actualNestedConditions[ 0 ].condition, condition );
        binaryExpressionParserStub.restore();
    } );
} );
