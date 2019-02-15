import IfStatementParser from "../src/IfStatmentParser";
import assert from "assert";
import sinon from "sinon";
import * as ParserFactory from "../src/ParserFactory";
import BinaryExpressionParser from "../src/BinaryExpressionParser";
import LogicalExpressionParser from "../src/LogicalExpressionParser";
import IdentifierParser from "../src/IdentifierParser";
import LiteralParser from "../src/LiteralParser";

describe( "parse If Statements", () => {
    let ifStatementParser,
        parserFactoryStub,
        binaryExpressionParserStub,
        logicalExpressionParserStub,
        identifierParserStub,
        literalParserStub;

    beforeEach( () => {
        ifStatementParser = new IfStatementParser();
        parserFactoryStub = sinon.stub( ParserFactory, "getParser" );
        binaryExpressionParserStub = sinon.stub( BinaryExpressionParser.prototype, "parse" );
        logicalExpressionParserStub = sinon.stub(LogicalExpressionParser.prototype, "parse");
        identifierParserStub = sinon.stub(IdentifierParser.prototype, "parse");
        literalParserStub = sinon.stub(LiteralParser.prototype, "parse");
    } );
    afterEach( () => {
        parserFactoryStub.restore();
        binaryExpressionParserStub.restore();
        logicalExpressionParserStub.restore();
        identifierParserStub.restore();
        literalParserStub.restore();
    } );

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

        binaryExpressionParserStub.returns( "Concept 1 with length greater than or equal to 2" );
        literalParserStub.returns("ConceptA");

        parserFactoryStub.onCall(0).returns( new LiteralParser() );
        parserFactoryStub.onCall(1).returns( new BinaryExpressionParser() );

        const parsedResult = ifStatementParser.parse( data, declarations );

        assert.equal( parsedResult[ 0 ].condition, condition );
        assert.equal( parsedResult[ 0 ].conceptsToHide[ 0 ], conceptsToHide );
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
            conceptsToHide = "ConceptX";

        binaryExpressionParserStub.onCall( 0 ).returns( "Concept 1 with length greater than or equal to 4" );
        binaryExpressionParserStub.onCall( 1 ).returns( "Concept 1 with length greater than or equal to 2" );
        literalParserStub.onCall(0).returns("ConceptA");
        literalParserStub.onCall(1).returns("ConceptX");

        parserFactoryStub.onCall(0).returns( new LiteralParser() );
        parserFactoryStub.onCall(1).returns( new LiteralParser() );
        parserFactoryStub.onCall(2).returns( new BinaryExpressionParser() );
        parserFactoryStub.onCall(3).returns( new BinaryExpressionParser() );

        const parsedResult = ifStatementParser.parse( data, declarations )[ 0 ];
        const actualNestedConditions = parsedResult.nestedConditions;

        assert.equal( actualNestedConditions.length, 1 );
        assert.equal( actualNestedConditions[ 0 ].conceptsToHide, conceptsToHide );
        assert.equal( actualNestedConditions[ 0 ].condition, condition );
    } );

    it( "should parse  if else conditions", () => {
        const data = {
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
                                        "type": "Identifier"
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
                    }
                ]
            },
            "alternate": {
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
                                        "name": "enable"
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
                                    "value": "ConceptB"
                                }
                            ]
                        }
                    }
                ]
            }
        };
        const declarations = { "conditionConcept": "Concept 1" };

        const condition = "if selected answers for Concept 1 with length greater than or equal to 2";
        const conceptsToHide = "ConceptA";
        const conceptsToShow = "ConceptB";

        binaryExpressionParserStub.onCall(0).returns("Concept 1 with length greater than or equal to 2");
        literalParserStub.onCall(0).returns("ConceptA");
        literalParserStub.onCall(1).returns("ConceptB");

        parserFactoryStub.onCall(0).returns(new LiteralParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        parserFactoryStub.onCall(2).returns(new BinaryExpressionParser());

        const parsedResult = ifStatementParser.parse(data, declarations);

        assert.equal( parsedResult.length, 2 );
        assert.equal( parsedResult[ 0 ].conceptsToShow, conceptsToShow );
        assert.equal( parsedResult[ 0 ].condition, "" );
        assert.equal( parsedResult[ 1 ].conceptsToHide, conceptsToHide );
        assert.equal( parsedResult[ 1 ].condition, condition );
    } );

    it( "should parse  if else if conditions", () => {
        const data = {
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
                    }
                ]
            },
            "alternate": {
                "type": "IfStatement",
                "test": {
                    "type": "BinaryExpression",
                    "operator": "==",
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
                                            "name": "show"
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
                                        "value": "ConceptT",
                                        "raw": "\"ConceptT\""
                                    }
                                ]
                            }
                        }
                    ]
                },
                "alternate": null
            }
        };
        const declarations = { "conditionConcept": "Concept 1" };

        const ifCondition = "if selected answers for Concept 1 with length greater than or equal to 2";
        const elseIfCondition = "if selected answers for Concept 1 with length equal to 2";
        const ifConceptsToHide = "ConceptA";
        const elseIfConceptsToHide = "ConceptT";

        binaryExpressionParserStub.onCall(1).returns("Concept 1 with length greater than or equal to 2");
        binaryExpressionParserStub.onCall(0).returns("Concept 1 with length equal to 2");
        literalParserStub.onCall(0).returns("ConceptA");
        literalParserStub.onCall(1).returns("ConceptT");

        parserFactoryStub.onCall(0).returns(new LiteralParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        parserFactoryStub.onCall(2).returns(new BinaryExpressionParser());
        parserFactoryStub.onCall(3).returns(new BinaryExpressionParser());

        const parsedResult = ifStatementParser.parse(data, declarations);

        assert.equal( parsedResult.length, 2 );
        assert.equal( parsedResult[ 0 ].conceptsToShow, elseIfConceptsToHide );
        assert.equal( parsedResult[ 0 ].condition, elseIfCondition );
        assert.equal( parsedResult[ 1 ].conceptsToHide, ifConceptsToHide );
        assert.equal( parsedResult[ 1 ].condition, ifCondition );
    } );

    it( "should parse  if elseif else conditions", () => {
        const data = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": ">=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "conditionConcept",
                        "loc": {
                            "start": {
                                "line": 8,
                                "column": 12
                            },
                            "end": {
                                "line": 8,
                                "column": 28
                            }
                        }
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "length",
                        "loc": {
                            "start": {
                                "line": 8,
                                "column": 29
                            },
                            "end": {
                                "line": 8,
                                "column": 35
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 8,
                            "column": 12
                        },
                        "end": {
                            "line": 8,
                            "column": 35
                        }
                    }
                },
                "right": {
                    "type": "Literal",
                    "value": 2,
                    "raw": "2",
                    "loc": {
                        "start": {
                            "line": 8,
                            "column": 39
                        },
                        "end": {
                            "line": 8,
                            "column": 40
                        }
                    }
                },
                "loc": {
                    "start": {
                        "line": 8,
                        "column": 12
                    },
                    "end": {
                        "line": 8,
                        "column": 40
                    }
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
                                        "name": "conditions",
                                        "loc": {
                                            "start": {
                                                "line": 9,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 22
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "hide",
                                        "loc": {
                                            "start": {
                                                "line": 9,
                                                "column": 23
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 27
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 27
                                        }
                                    }
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "push",
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 28
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 32
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 9,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 9,
                                        "column": 32
                                    }
                                }
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": "ConceptA",
                                    "raw": "\"ConceptA\"",
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 33
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 43
                                        }
                                    }
                                }
                            ],
                            "loc": {
                                "start": {
                                    "line": 9,
                                    "column": 12
                                },
                                "end": {
                                    "line": 9,
                                    "column": 44
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 9,
                                "column": 12
                            },
                            "end": {
                                "line": 9,
                                "column": 45
                            }
                        }
                    }
                ],
                "loc": {
                    "start": {
                        "line": 8,
                        "column": 42
                    },
                    "end": {
                        "line": 10,
                        "column": 8
                    }
                }
            },
            "alternate": {
                "type": "IfStatement",
                "test": {
                    "type": "BinaryExpression",
                    "operator": "==",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "conditionConcept",
                            "loc": {
                                "start": {
                                    "line": 11,
                                    "column": 17
                                },
                                "end": {
                                    "line": 11,
                                    "column": 33
                                }
                            }
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "length",
                            "loc": {
                                "start": {
                                    "line": 11,
                                    "column": 34
                                },
                                "end": {
                                    "line": 11,
                                    "column": 40
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 11,
                                "column": 17
                            },
                            "end": {
                                "line": 11,
                                "column": 40
                            }
                        }
                    },
                    "right": {
                        "type": "Literal",
                        "value": 9,
                        "raw": "9",
                        "loc": {
                            "start": {
                                "line": 11,
                                "column": 44
                            },
                            "end": {
                                "line": 11,
                                "column": 45
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 11,
                            "column": 17
                        },
                        "end": {
                            "line": 11,
                            "column": 45
                        }
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
                                            "name": "conditions",
                                            "loc": {
                                                "start": {
                                                    "line": 12,
                                                    "column": 12
                                                },
                                                "end": {
                                                    "line": 12,
                                                    "column": 22
                                                }
                                            }
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "show",
                                            "loc": {
                                                "start": {
                                                    "line": 12,
                                                    "column": 23
                                                },
                                                "end": {
                                                    "line": 12,
                                                    "column": 27
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 27
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "push",
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 28
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 32
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 12,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 12,
                                            "column": 32
                                        }
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "ConceptZ",
                                        "raw": "\"ConceptZ\"",
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 33
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 43
                                            }
                                        }
                                    }
                                ],
                                "loc": {
                                    "start": {
                                        "line": 12,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 12,
                                        "column": 44
                                    }
                                }
                            },
                            "loc": {
                                "start": {
                                    "line": 12,
                                    "column": 12
                                },
                                "end": {
                                    "line": 12,
                                    "column": 45
                                }
                            }
                        }
                    ],
                    "loc": {
                        "start": {
                            "line": 11,
                            "column": 47
                        },
                        "end": {
                            "line": 13,
                            "column": 9
                        }
                    }
                },
                "alternate": {
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
                                            "name": "conditions",
                                            "loc": {
                                                "start": {
                                                    "line": 15,
                                                    "column": 12
                                                },
                                                "end": {
                                                    "line": 15,
                                                    "column": 22
                                                }
                                            }
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "show",
                                            "loc": {
                                                "start": {
                                                    "line": 15,
                                                    "column": 23
                                                },
                                                "end": {
                                                    "line": 15,
                                                    "column": 27
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 15,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 15,
                                                "column": 27
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "push",
                                        "loc": {
                                            "start": {
                                                "line": 15,
                                                "column": 28
                                            },
                                            "end": {
                                                "line": 15,
                                                "column": 32
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 15,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 15,
                                            "column": 32
                                        }
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "ConceptY",
                                        "raw": "\"ConceptY\"",
                                        "loc": {
                                            "start": {
                                                "line": 15,
                                                "column": 33
                                            },
                                            "end": {
                                                "line": 15,
                                                "column": 43
                                            }
                                        }
                                    }
                                ],
                                "loc": {
                                    "start": {
                                        "line": 15,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 15,
                                        "column": 44
                                    }
                                }
                            },
                            "loc": {
                                "start": {
                                    "line": 15,
                                    "column": 12
                                },
                                "end": {
                                    "line": 15,
                                    "column": 45
                                }
                            }
                        }
                    ],
                    "loc": {
                        "start": {
                            "line": 14,
                            "column": 12
                        },
                        "end": {
                            "line": 16,
                            "column": 9
                        }
                    }
                },
                "loc": {
                    "start": {
                        "line": 11,
                        "column": 13
                    },
                    "end": {
                        "line": 16,
                        "column": 9
                    }
                }
            },
            "loc": {
                "start": {
                    "line": 8,
                    "column": 8
                },
                "end": {
                    "line": 16,
                    "column": 9
                }
            }
        };
        const declarations = { "conditionConcept": "Concept 1" };

        const ifCondition = "if selected answers for Concept 1 with length greater than or equal to 2";
        const elseIfCondition = "if selected answers for Concept 1 with length equal to 9";
        const ifConceptsToHide = "ConceptA";
        const elseIfConceptsToShow = "ConceptZ";
        const elseConceptsToShow = "ConceptY";

        binaryExpressionParserStub.onCall(1).returns("Concept 1 with length greater than or equal to 2");
        binaryExpressionParserStub.onCall(0).returns("Concept 1 with length equal to 9");
        literalParserStub.onCall(0).returns("ConceptA");
        literalParserStub.onCall(1).returns("ConceptZ");
        literalParserStub.onCall(2).returns("ConceptY");

        parserFactoryStub.onCall(0).returns(new LiteralParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        parserFactoryStub.onCall(2).returns(new LiteralParser());
        parserFactoryStub.onCall(3).returns(new BinaryExpressionParser());
        parserFactoryStub.onCall(4).returns(new BinaryExpressionParser());

        const parsedResult = ifStatementParser.parse(data, declarations);

        assert.equal( parsedResult.length, 3 );
        assert.equal( parsedResult[ 0 ].conceptsToShow, elseConceptsToShow );
        assert.equal( parsedResult[ 0 ].condition, "" );
        assert.equal( parsedResult[ 1 ].conceptsToShow, elseIfConceptsToShow );
        assert.equal( parsedResult[ 1 ].condition, elseIfCondition );
        assert.equal( parsedResult[ 2 ].conceptsToHide, ifConceptsToHide );
        assert.equal( parsedResult[ 2 ].condition, ifCondition );
    } );

    it( "should parse  if elseif elseif conditions", () => {
        const data = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": ">=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "conditionConcept",
                        "loc": {
                            "start": {
                                "line": 8,
                                "column": 12
                            },
                            "end": {
                                "line": 8,
                                "column": 28
                            }
                        }
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "length",
                        "loc": {
                            "start": {
                                "line": 8,
                                "column": 29
                            },
                            "end": {
                                "line": 8,
                                "column": 35
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 8,
                            "column": 12
                        },
                        "end": {
                            "line": 8,
                            "column": 35
                        }
                    }
                },
                "right": {
                    "type": "Literal",
                    "value": 2,
                    "raw": "2",
                    "loc": {
                        "start": {
                            "line": 8,
                            "column": 39
                        },
                        "end": {
                            "line": 8,
                            "column": 40
                        }
                    }
                },
                "loc": {
                    "start": {
                        "line": 8,
                        "column": 12
                    },
                    "end": {
                        "line": 8,
                        "column": 40
                    }
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
                                        "name": "conditions",
                                        "loc": {
                                            "start": {
                                                "line": 9,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 22
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "hide",
                                        "loc": {
                                            "start": {
                                                "line": 9,
                                                "column": 23
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 27
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 27
                                        }
                                    }
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "push",
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 28
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 32
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 9,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 9,
                                        "column": 32
                                    }
                                }
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": "ConceptA",
                                    "raw": "\"ConceptA\"",
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 33
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 43
                                        }
                                    }
                                }
                            ],
                            "loc": {
                                "start": {
                                    "line": 9,
                                    "column": 12
                                },
                                "end": {
                                    "line": 9,
                                    "column": 44
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 9,
                                "column": 12
                            },
                            "end": {
                                "line": 9,
                                "column": 45
                            }
                        }
                    }
                ],
                "loc": {
                    "start": {
                        "line": 8,
                        "column": 42
                    },
                    "end": {
                        "line": 10,
                        "column": 9
                    }
                }
            },
            "alternate": {
                "type": "IfStatement",
                "test": {
                    "type": "BinaryExpression",
                    "operator": "==",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "conditionConcept",
                            "loc": {
                                "start": {
                                    "line": 11,
                                    "column": 17
                                },
                                "end": {
                                    "line": 11,
                                    "column": 33
                                }
                            }
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "length",
                            "loc": {
                                "start": {
                                    "line": 11,
                                    "column": 34
                                },
                                "end": {
                                    "line": 11,
                                    "column": 40
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 11,
                                "column": 17
                            },
                            "end": {
                                "line": 11,
                                "column": 40
                            }
                        }
                    },
                    "right": {
                        "type": "Literal",
                        "value": 2,
                        "raw": "2",
                        "loc": {
                            "start": {
                                "line": 11,
                                "column": 44
                            },
                            "end": {
                                "line": 11,
                                "column": 45
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 11,
                            "column": 17
                        },
                        "end": {
                            "line": 11,
                            "column": 45
                        }
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
                                            "name": "conditions",
                                            "loc": {
                                                "start": {
                                                    "line": 12,
                                                    "column": 12
                                                },
                                                "end": {
                                                    "line": 12,
                                                    "column": 22
                                                }
                                            }
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "show",
                                            "loc": {
                                                "start": {
                                                    "line": 12,
                                                    "column": 23
                                                },
                                                "end": {
                                                    "line": 12,
                                                    "column": 27
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 27
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "push",
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 28
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 32
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 12,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 12,
                                            "column": 32
                                        }
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "ConceptT",
                                        "raw": "\"ConceptT\"",
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 33
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 43
                                            }
                                        }
                                    }
                                ],
                                "loc": {
                                    "start": {
                                        "line": 12,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 12,
                                        "column": 44
                                    }
                                }
                            },
                            "loc": {
                                "start": {
                                    "line": 12,
                                    "column": 12
                                },
                                "end": {
                                    "line": 12,
                                    "column": 45
                                }
                            }
                        }
                    ],
                    "loc": {
                        "start": {
                            "line": 11,
                            "column": 47
                        },
                        "end": {
                            "line": 13,
                            "column": 9
                        }
                    }
                },
                "alternate": {
                    "type": "IfStatement",
                    "test": {
                        "type": "BinaryExpression",
                        "operator": "==",
                        "left": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "conditionConcept",
                                "loc": {
                                    "start": {
                                        "line": 14,
                                        "column": 17
                                    },
                                    "end": {
                                        "line": 14,
                                        "column": 33
                                    }
                                }
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "length",
                                "loc": {
                                    "start": {
                                        "line": 14,
                                        "column": 34
                                    },
                                    "end": {
                                        "line": 14,
                                        "column": 40
                                    }
                                }
                            },
                            "loc": {
                                "start": {
                                    "line": 14,
                                    "column": 17
                                },
                                "end": {
                                    "line": 14,
                                    "column": 40
                                }
                            }
                        },
                        "right": {
                            "type": "Literal",
                            "value": 9,
                            "raw": "9",
                            "loc": {
                                "start": {
                                    "line": 14,
                                    "column": 44
                                },
                                "end": {
                                    "line": 14,
                                    "column": 45
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 14,
                                "column": 17
                            },
                            "end": {
                                "line": 14,
                                "column": 45
                            }
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
                                                "name": "conditions",
                                                "loc": {
                                                    "start": {
                                                        "line": 15,
                                                        "column": 12
                                                    },
                                                    "end": {
                                                        "line": 15,
                                                        "column": 22
                                                    }
                                                }
                                            },
                                            "property": {
                                                "type": "Identifier",
                                                "name": "show",
                                                "loc": {
                                                    "start": {
                                                        "line": 15,
                                                        "column": 23
                                                    },
                                                    "end": {
                                                        "line": 15,
                                                        "column": 27
                                                    }
                                                }
                                            },
                                            "loc": {
                                                "start": {
                                                    "line": 15,
                                                    "column": 12
                                                },
                                                "end": {
                                                    "line": 15,
                                                    "column": 27
                                                }
                                            }
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "push",
                                            "loc": {
                                                "start": {
                                                    "line": 15,
                                                    "column": 28
                                                },
                                                "end": {
                                                    "line": 15,
                                                    "column": 32
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 15,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 15,
                                                "column": 32
                                            }
                                        }
                                    },
                                    "arguments": [
                                        {
                                            "type": "Literal",
                                            "value": "ConceptZ",
                                            "raw": "\"ConceptZ\"",
                                            "loc": {
                                                "start": {
                                                    "line": 15,
                                                    "column": 33
                                                },
                                                "end": {
                                                    "line": 15,
                                                    "column": 43
                                                }
                                            }
                                        }
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 15,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 15,
                                            "column": 44
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 15,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 15,
                                        "column": 45
                                    }
                                }
                            }
                        ],
                        "loc": {
                            "start": {
                                "line": 14,
                                "column": 47
                            },
                            "end": {
                                "line": 16,
                                "column": 9
                            }
                        }
                    },
                    "alternate": null,
                    "loc": {
                        "start": {
                            "line": 14,
                            "column": 13
                        },
                        "end": {
                            "line": 16,
                            "column": 9
                        }
                    }
                },
                "loc": {
                    "start": {
                        "line": 11,
                        "column": 13
                    },
                    "end": {
                        "line": 16,
                        "column": 9
                    }
                }
            },
            "loc": {
                "start": {
                    "line": 8,
                    "column": 8
                },
                "end": {
                    "line": 16,
                    "column": 9
                }
            }
        };
        const declarations = { "conditionConcept": "Concept 1" };

        const ifCondition = "if selected answers for Concept 1 with length greater than or equal to 2";
        const elseIfCondition1 = "if selected answers for Concept 1 with length equal to 2";
        const elseIfCondition2 = "if selected answers for Concept 1 with length equal to 9";
        const ifConceptsToHide = "ConceptA";
        const elseIfConceptsToShow1 = "ConceptT";
        const elseIfConceptsToShow2 = "ConceptZ";

        binaryExpressionParserStub.onCall(2).returns("Concept 1 with length greater than or equal to 2");
        binaryExpressionParserStub.onCall(1).returns("Concept 1 with length equal to 2");
        binaryExpressionParserStub.onCall(0).returns("Concept 1 with length equal to 9");
        literalParserStub.onCall(0).returns("ConceptA");
        literalParserStub.onCall(1).returns("ConceptT");
        literalParserStub.onCall(2).returns("ConceptZ");

        parserFactoryStub.onCall(0).returns(new LiteralParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        parserFactoryStub.onCall(2).returns(new LiteralParser());
        parserFactoryStub.onCall(3).returns(new BinaryExpressionParser());
        parserFactoryStub.onCall(4).returns(new BinaryExpressionParser());
        parserFactoryStub.onCall(5).returns(new BinaryExpressionParser());

        const parsedResult = ifStatementParser.parse(data, declarations);

        assert.equal( parsedResult.length, 3 );
        assert.equal( parsedResult[ 0 ].conceptsToShow, elseIfConceptsToShow2 );
        assert.equal( parsedResult[ 0 ].condition, elseIfCondition2 );
        assert.equal( parsedResult[ 1 ].conceptsToShow, elseIfConceptsToShow1 );
        assert.equal( parsedResult[ 1 ].condition, elseIfCondition1 );
        assert.equal( parsedResult[ 2 ].conceptsToHide, ifConceptsToHide );
        assert.equal( parsedResult[ 2 ].condition, ifCondition );
    } );

    it( "should parse  if elseif elseif else conditions", () => {
        const data = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": ">=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "conditionConcept",
                        "loc": {
                            "start": {
                                "line": 8,
                                "column": 12
                            },
                            "end": {
                                "line": 8,
                                "column": 28
                            }
                        }
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "length",
                        "loc": {
                            "start": {
                                "line": 8,
                                "column": 29
                            },
                            "end": {
                                "line": 8,
                                "column": 35
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 8,
                            "column": 12
                        },
                        "end": {
                            "line": 8,
                            "column": 35
                        }
                    }
                },
                "right": {
                    "type": "Literal",
                    "value": 2,
                    "raw": "2",
                    "loc": {
                        "start": {
                            "line": 8,
                            "column": 39
                        },
                        "end": {
                            "line": 8,
                            "column": 40
                        }
                    }
                },
                "loc": {
                    "start": {
                        "line": 8,
                        "column": 12
                    },
                    "end": {
                        "line": 8,
                        "column": 40
                    }
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
                                        "name": "conditions",
                                        "loc": {
                                            "start": {
                                                "line": 9,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 22
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "hide",
                                        "loc": {
                                            "start": {
                                                "line": 9,
                                                "column": 23
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 27
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 27
                                        }
                                    }
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "push",
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 28
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 32
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 9,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 9,
                                        "column": 32
                                    }
                                }
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": "ConceptA",
                                    "raw": "\"ConceptA\"",
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 33
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 43
                                        }
                                    }
                                }
                            ],
                            "loc": {
                                "start": {
                                    "line": 9,
                                    "column": 12
                                },
                                "end": {
                                    "line": 9,
                                    "column": 44
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 9,
                                "column": 12
                            },
                            "end": {
                                "line": 9,
                                "column": 45
                            }
                        }
                    }
                ],
                "loc": {
                    "start": {
                        "line": 8,
                        "column": 42
                    },
                    "end": {
                        "line": 10,
                        "column": 8
                    }
                }
            },
            "alternate": {
                "type": "IfStatement",
                "test": {
                    "type": "BinaryExpression",
                    "operator": "==",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "conditionConcept",
                            "loc": {
                                "start": {
                                    "line": 11,
                                    "column": 17
                                },
                                "end": {
                                    "line": 11,
                                    "column": 33
                                }
                            }
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "length",
                            "loc": {
                                "start": {
                                    "line": 11,
                                    "column": 34
                                },
                                "end": {
                                    "line": 11,
                                    "column": 40
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 11,
                                "column": 17
                            },
                            "end": {
                                "line": 11,
                                "column": 40
                            }
                        }
                    },
                    "right": {
                        "type": "Literal",
                        "value": 2,
                        "raw": "2",
                        "loc": {
                            "start": {
                                "line": 11,
                                "column": 44
                            },
                            "end": {
                                "line": 11,
                                "column": 45
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 11,
                            "column": 17
                        },
                        "end": {
                            "line": 11,
                            "column": 45
                        }
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
                                            "name": "conditions",
                                            "loc": {
                                                "start": {
                                                    "line": 12,
                                                    "column": 12
                                                },
                                                "end": {
                                                    "line": 12,
                                                    "column": 22
                                                }
                                            }
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "show",
                                            "loc": {
                                                "start": {
                                                    "line": 12,
                                                    "column": 23
                                                },
                                                "end": {
                                                    "line": 12,
                                                    "column": 27
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 27
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "push",
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 28
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 32
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 12,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 12,
                                            "column": 32
                                        }
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "ConceptT",
                                        "raw": "\"ConceptT\"",
                                        "loc": {
                                            "start": {
                                                "line": 12,
                                                "column": 33
                                            },
                                            "end": {
                                                "line": 12,
                                                "column": 43
                                            }
                                        }
                                    }
                                ],
                                "loc": {
                                    "start": {
                                        "line": 12,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 12,
                                        "column": 44
                                    }
                                }
                            },
                            "loc": {
                                "start": {
                                    "line": 12,
                                    "column": 12
                                },
                                "end": {
                                    "line": 12,
                                    "column": 45
                                }
                            }
                        }
                    ],
                    "loc": {
                        "start": {
                            "line": 11,
                            "column": 47
                        },
                        "end": {
                            "line": 13,
                            "column": 9
                        }
                    }
                },
                "alternate": {
                    "type": "IfStatement",
                    "test": {
                        "type": "BinaryExpression",
                        "operator": "==",
                        "left": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "conditionConcept",
                                "loc": {
                                    "start": {
                                        "line": 14,
                                        "column": 17
                                    },
                                    "end": {
                                        "line": 14,
                                        "column": 33
                                    }
                                }
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "length",
                                "loc": {
                                    "start": {
                                        "line": 14,
                                        "column": 34
                                    },
                                    "end": {
                                        "line": 14,
                                        "column": 40
                                    }
                                }
                            },
                            "loc": {
                                "start": {
                                    "line": 14,
                                    "column": 17
                                },
                                "end": {
                                    "line": 14,
                                    "column": 40
                                }
                            }
                        },
                        "right": {
                            "type": "Literal",
                            "value": 9,
                            "raw": "9",
                            "loc": {
                                "start": {
                                    "line": 14,
                                    "column": 44
                                },
                                "end": {
                                    "line": 14,
                                    "column": 45
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 14,
                                "column": 17
                            },
                            "end": {
                                "line": 14,
                                "column": 45
                            }
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
                                                "name": "conditions",
                                                "loc": {
                                                    "start": {
                                                        "line": 15,
                                                        "column": 12
                                                    },
                                                    "end": {
                                                        "line": 15,
                                                        "column": 22
                                                    }
                                                }
                                            },
                                            "property": {
                                                "type": "Identifier",
                                                "name": "show",
                                                "loc": {
                                                    "start": {
                                                        "line": 15,
                                                        "column": 23
                                                    },
                                                    "end": {
                                                        "line": 15,
                                                        "column": 27
                                                    }
                                                }
                                            },
                                            "loc": {
                                                "start": {
                                                    "line": 15,
                                                    "column": 12
                                                },
                                                "end": {
                                                    "line": 15,
                                                    "column": 27
                                                }
                                            }
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "push",
                                            "loc": {
                                                "start": {
                                                    "line": 15,
                                                    "column": 28
                                                },
                                                "end": {
                                                    "line": 15,
                                                    "column": 32
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 15,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 15,
                                                "column": 32
                                            }
                                        }
                                    },
                                    "arguments": [
                                        {
                                            "type": "Literal",
                                            "value": "ConceptZ",
                                            "raw": "\"ConceptZ\"",
                                            "loc": {
                                                "start": {
                                                    "line": 15,
                                                    "column": 33
                                                },
                                                "end": {
                                                    "line": 15,
                                                    "column": 43
                                                }
                                            }
                                        }
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 15,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 15,
                                            "column": 44
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 15,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 15,
                                        "column": 45
                                    }
                                }
                            }
                        ],
                        "loc": {
                            "start": {
                                "line": 14,
                                "column": 47
                            },
                            "end": {
                                "line": 16,
                                "column": 9
                            }
                        }
                    },
                    "alternate": {
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
                                                "name": "conditions",
                                                "loc": {
                                                    "start": {
                                                        "line": 18,
                                                        "column": 12
                                                    },
                                                    "end": {
                                                        "line": 18,
                                                        "column": 22
                                                    }
                                                }
                                            },
                                            "property": {
                                                "type": "Identifier",
                                                "name": "show",
                                                "loc": {
                                                    "start": {
                                                        "line": 18,
                                                        "column": 23
                                                    },
                                                    "end": {
                                                        "line": 18,
                                                        "column": 27
                                                    }
                                                }
                                            },
                                            "loc": {
                                                "start": {
                                                    "line": 18,
                                                    "column": 12
                                                },
                                                "end": {
                                                    "line": 18,
                                                    "column": 27
                                                }
                                            }
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "push",
                                            "loc": {
                                                "start": {
                                                    "line": 18,
                                                    "column": 28
                                                },
                                                "end": {
                                                    "line": 18,
                                                    "column": 32
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 18,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 18,
                                                "column": 32
                                            }
                                        }
                                    },
                                    "arguments": [
                                        {
                                            "type": "Literal",
                                            "value": "ConceptY",
                                            "raw": "\"ConceptY\"",
                                            "loc": {
                                                "start": {
                                                    "line": 18,
                                                    "column": 33
                                                },
                                                "end": {
                                                    "line": 18,
                                                    "column": 43
                                                }
                                            }
                                        }
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 18,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 18,
                                            "column": 44
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 18,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 18,
                                        "column": 45
                                    }
                                }
                            }
                        ],
                        "loc": {
                            "start": {
                                "line": 17,
                                "column": 12
                            },
                            "end": {
                                "line": 19,
                                "column": 9
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 14,
                            "column": 13
                        },
                        "end": {
                            "line": 19,
                            "column": 9
                        }
                    }
                },
                "loc": {
                    "start": {
                        "line": 11,
                        "column": 13
                    },
                    "end": {
                        "line": 19,
                        "column": 9
                    }
                }
            },
            "loc": {
                "start": {
                    "line": 8,
                    "column": 8
                },
                "end": {
                    "line": 19,
                    "column": 9
                }
            }
        };
        const declarations = { "conditionConcept": "Concept 1" };

        const ifCondition = "if selected answers for Concept 1 with length greater than or equal to 2";
        const elseIfCondition1 = "if selected answers for Concept 1 with length equal to 2";
        const elseIfCondition2 = "if selected answers for Concept 1 with length equal to 9";
        const ifConceptsToHide = "ConceptA";
        const elseIfConceptsToShow1 = "ConceptT";
        const elseIfConceptsToShow2 = "ConceptZ";
        const elseConceptsToShow = "ConceptY";

        binaryExpressionParserStub.onCall(2).returns("Concept 1 with length greater than or equal to 2");
        binaryExpressionParserStub.onCall(1).returns("Concept 1 with length equal to 2");
        binaryExpressionParserStub.onCall(0).returns("Concept 1 with length equal to 9");
        literalParserStub.onCall(0).returns("ConceptA");
        literalParserStub.onCall(1).returns("ConceptT");
        literalParserStub.onCall(2).returns("ConceptZ");
        literalParserStub.onCall(3).returns("ConceptY");

        parserFactoryStub.onCall(0).returns(new LiteralParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        parserFactoryStub.onCall(2).returns(new LiteralParser());
        parserFactoryStub.onCall(3).returns(new LiteralParser());
        parserFactoryStub.onCall(4).returns(new BinaryExpressionParser());
        parserFactoryStub.onCall(5).returns(new BinaryExpressionParser());
        parserFactoryStub.onCall(6).returns(new BinaryExpressionParser());

        const parsedResult = ifStatementParser.parse(data, declarations);

        assert.equal( parsedResult.length, 4 );
        assert.equal( parsedResult[ 0 ].conceptsToShow, elseConceptsToShow );
        assert.equal( parsedResult[ 0 ].condition, "" );
        assert.equal( parsedResult[ 1 ].conceptsToShow, elseIfConceptsToShow2 );
        assert.equal( parsedResult[ 1 ].condition, elseIfCondition2 );
        assert.equal( parsedResult[ 2 ].conceptsToShow, elseIfConceptsToShow1 );
        assert.equal( parsedResult[ 2 ].condition, elseIfCondition1 );
        assert.equal( parsedResult[ 3 ].conceptsToHide, ifConceptsToHide );
        assert.equal( parsedResult[ 3 ].condition, ifCondition );
    } );

    it( "should parse if with nested if elseif else conditions", () => {
        const data = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": ">=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "conditionConcept",
                        "loc": {
                            "start": {
                                "line": 8,
                                "column": 12
                            },
                            "end": {
                                "line": 8,
                                "column": 28
                            }
                        }
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "length",
                        "loc": {
                            "start": {
                                "line": 8,
                                "column": 29
                            },
                            "end": {
                                "line": 8,
                                "column": 35
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 8,
                            "column": 12
                        },
                        "end": {
                            "line": 8,
                            "column": 35
                        }
                    }
                },
                "right": {
                    "type": "Literal",
                    "value": 2,
                    "raw": "2",
                    "loc": {
                        "start": {
                            "line": 8,
                            "column": 39
                        },
                        "end": {
                            "line": 8,
                            "column": 40
                        }
                    }
                },
                "loc": {
                    "start": {
                        "line": 8,
                        "column": 12
                    },
                    "end": {
                        "line": 8,
                        "column": 40
                    }
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
                                        "name": "conditions",
                                        "loc": {
                                            "start": {
                                                "line": 9,
                                                "column": 12
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 22
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "hide",
                                        "loc": {
                                            "start": {
                                                "line": 9,
                                                "column": 23
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 27
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 27
                                        }
                                    }
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "push",
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 28
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 32
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 9,
                                        "column": 12
                                    },
                                    "end": {
                                        "line": 9,
                                        "column": 32
                                    }
                                }
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": "ConceptA",
                                    "raw": "\"ConceptA\"",
                                    "loc": {
                                        "start": {
                                            "line": 9,
                                            "column": 33
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 43
                                        }
                                    }
                                }
                            ],
                            "loc": {
                                "start": {
                                    "line": 9,
                                    "column": 12
                                },
                                "end": {
                                    "line": 9,
                                    "column": 44
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 9,
                                "column": 12
                            },
                            "end": {
                                "line": 9,
                                "column": 45
                            }
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
                                    "name": "conditionConcept",
                                    "loc": {
                                        "start": {
                                            "line": 10,
                                            "column": 16
                                        },
                                        "end": {
                                            "line": 10,
                                            "column": 32
                                        }
                                    }
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "length",
                                    "loc": {
                                        "start": {
                                            "line": 10,
                                            "column": 33
                                        },
                                        "end": {
                                            "line": 10,
                                            "column": 39
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 10,
                                        "column": 16
                                    },
                                    "end": {
                                        "line": 10,
                                        "column": 39
                                    }
                                }
                            },
                            "right": {
                                "type": "Literal",
                                "value": 4,
                                "raw": "4",
                                "loc": {
                                    "start": {
                                        "line": 10,
                                        "column": 43
                                    },
                                    "end": {
                                        "line": 10,
                                        "column": 44
                                    }
                                }
                            },
                            "loc": {
                                "start": {
                                    "line": 10,
                                    "column": 16
                                },
                                "end": {
                                    "line": 10,
                                    "column": 44
                                }
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
                                                    "name": "conditions",
                                                    "loc": {
                                                        "start": {
                                                            "line": 11,
                                                            "column": 16
                                                        },
                                                        "end": {
                                                            "line": 11,
                                                            "column": 26
                                                        }
                                                    }
                                                },
                                                "property": {
                                                    "type": "Identifier",
                                                    "name": "hide",
                                                    "loc": {
                                                        "start": {
                                                            "line": 11,
                                                            "column": 27
                                                        },
                                                        "end": {
                                                            "line": 11,
                                                            "column": 31
                                                        }
                                                    }
                                                },
                                                "loc": {
                                                    "start": {
                                                        "line": 11,
                                                        "column": 16
                                                    },
                                                    "end": {
                                                        "line": 11,
                                                        "column": 31
                                                    }
                                                }
                                            },
                                            "property": {
                                                "type": "Identifier",
                                                "name": "push",
                                                "loc": {
                                                    "start": {
                                                        "line": 11,
                                                        "column": 32
                                                    },
                                                    "end": {
                                                        "line": 11,
                                                        "column": 36
                                                    }
                                                }
                                            },
                                            "loc": {
                                                "start": {
                                                    "line": 11,
                                                    "column": 16
                                                },
                                                "end": {
                                                    "line": 11,
                                                    "column": 36
                                                }
                                            }
                                        },
                                        "arguments": [
                                            {
                                                "type": "Literal",
                                                "value": "ConceptB",
                                                "raw": "\"ConceptB\"",
                                                "loc": {
                                                    "start": {
                                                        "line": 11,
                                                        "column": 37
                                                    },
                                                    "end": {
                                                        "line": 11,
                                                        "column": 47
                                                    }
                                                }
                                            }
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 11,
                                                "column": 16
                                            },
                                            "end": {
                                                "line": 11,
                                                "column": 48
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 11,
                                            "column": 16
                                        },
                                        "end": {
                                            "line": 11,
                                            "column": 49
                                        }
                                    }
                                }
                            ],
                            "loc": {
                                "start": {
                                    "line": 10,
                                    "column": 46
                                },
                                "end": {
                                    "line": 12,
                                    "column": 13
                                }
                            }
                        },
                        "alternate": {
                            "type": "IfStatement",
                            "test": {
                                "type": "BinaryExpression",
                                "operator": "==",
                                "left": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "conditionConcept",
                                        "loc": {
                                            "start": {
                                                "line": 13,
                                                "column": 21
                                            },
                                            "end": {
                                                "line": 13,
                                                "column": 37
                                            }
                                        }
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "length",
                                        "loc": {
                                            "start": {
                                                "line": 13,
                                                "column": 38
                                            },
                                            "end": {
                                                "line": 13,
                                                "column": 44
                                            }
                                        }
                                    },
                                    "loc": {
                                        "start": {
                                            "line": 13,
                                            "column": 21
                                        },
                                        "end": {
                                            "line": 13,
                                            "column": 44
                                        }
                                    }
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 2,
                                    "raw": "2",
                                    "loc": {
                                        "start": {
                                            "line": 13,
                                            "column": 48
                                        },
                                        "end": {
                                            "line": 13,
                                            "column": 49
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 13,
                                        "column": 21
                                    },
                                    "end": {
                                        "line": 13,
                                        "column": 49
                                    }
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
                                                        "name": "conditions",
                                                        "loc": {
                                                            "start": {
                                                                "line": 14,
                                                                "column": 16
                                                            },
                                                            "end": {
                                                                "line": 14,
                                                                "column": 26
                                                            }
                                                        }
                                                    },
                                                    "property": {
                                                        "type": "Identifier",
                                                        "name": "show",
                                                        "loc": {
                                                            "start": {
                                                                "line": 14,
                                                                "column": 27
                                                            },
                                                            "end": {
                                                                "line": 14,
                                                                "column": 31
                                                            }
                                                        }
                                                    },
                                                    "loc": {
                                                        "start": {
                                                            "line": 14,
                                                            "column": 16
                                                        },
                                                        "end": {
                                                            "line": 14,
                                                            "column": 31
                                                        }
                                                    }
                                                },
                                                "property": {
                                                    "type": "Identifier",
                                                    "name": "push",
                                                    "loc": {
                                                        "start": {
                                                            "line": 14,
                                                            "column": 32
                                                        },
                                                        "end": {
                                                            "line": 14,
                                                            "column": 36
                                                        }
                                                    }
                                                },
                                                "loc": {
                                                    "start": {
                                                        "line": 14,
                                                        "column": 16
                                                    },
                                                    "end": {
                                                        "line": 14,
                                                        "column": 36
                                                    }
                                                }
                                            },
                                            "arguments": [
                                                {
                                                    "type": "Literal",
                                                    "value": "ConceptT",
                                                    "raw": "\"ConceptT\"",
                                                    "loc": {
                                                        "start": {
                                                            "line": 14,
                                                            "column": 37
                                                        },
                                                        "end": {
                                                            "line": 14,
                                                            "column": 47
                                                        }
                                                    }
                                                }
                                            ],
                                            "loc": {
                                                "start": {
                                                    "line": 14,
                                                    "column": 16
                                                },
                                                "end": {
                                                    "line": 14,
                                                    "column": 48
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 14,
                                                "column": 16
                                            },
                                            "end": {
                                                "line": 14,
                                                "column": 49
                                            }
                                        }
                                    }
                                ],
                                "loc": {
                                    "start": {
                                        "line": 13,
                                        "column": 51
                                    },
                                    "end": {
                                        "line": 15,
                                        "column": 13
                                    }
                                }
                            },
                            "alternate": {
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
                                                        "name": "conditions",
                                                        "loc": {
                                                            "start": {
                                                                "line": 17,
                                                                "column": 16
                                                            },
                                                            "end": {
                                                                "line": 17,
                                                                "column": 26
                                                            }
                                                        }
                                                    },
                                                    "property": {
                                                        "type": "Identifier",
                                                        "name": "show",
                                                        "loc": {
                                                            "start": {
                                                                "line": 17,
                                                                "column": 27
                                                            },
                                                            "end": {
                                                                "line": 17,
                                                                "column": 31
                                                            }
                                                        }
                                                    },
                                                    "loc": {
                                                        "start": {
                                                            "line": 17,
                                                            "column": 16
                                                        },
                                                        "end": {
                                                            "line": 17,
                                                            "column": 31
                                                        }
                                                    }
                                                },
                                                "property": {
                                                    "type": "Identifier",
                                                    "name": "push",
                                                    "loc": {
                                                        "start": {
                                                            "line": 17,
                                                            "column": 32
                                                        },
                                                        "end": {
                                                            "line": 17,
                                                            "column": 36
                                                        }
                                                    }
                                                },
                                                "loc": {
                                                    "start": {
                                                        "line": 17,
                                                        "column": 16
                                                    },
                                                    "end": {
                                                        "line": 17,
                                                        "column": 36
                                                    }
                                                }
                                            },
                                            "arguments": [
                                                {
                                                    "type": "Literal",
                                                    "value": "ConceptX",
                                                    "raw": "\"ConceptX\"",
                                                    "loc": {
                                                        "start": {
                                                            "line": 17,
                                                            "column": 37
                                                        },
                                                        "end": {
                                                            "line": 17,
                                                            "column": 47
                                                        }
                                                    }
                                                }
                                            ],
                                            "loc": {
                                                "start": {
                                                    "line": 17,
                                                    "column": 16
                                                },
                                                "end": {
                                                    "line": 17,
                                                    "column": 48
                                                }
                                            }
                                        },
                                        "loc": {
                                            "start": {
                                                "line": 17,
                                                "column": 16
                                            },
                                            "end": {
                                                "line": 17,
                                                "column": 49
                                            }
                                        }
                                    }
                                ],
                                "loc": {
                                    "start": {
                                        "line": 16,
                                        "column": 17
                                    },
                                    "end": {
                                        "line": 18,
                                        "column": 13
                                    }
                                }
                            },
                            "loc": {
                                "start": {
                                    "line": 13,
                                    "column": 17
                                },
                                "end": {
                                    "line": 18,
                                    "column": 13
                                }
                            }
                        },
                        "loc": {
                            "start": {
                                "line": 10,
                                "column": 12
                            },
                            "end": {
                                "line": 18,
                                "column": 13
                            }
                        }
                    }
                ],
                "loc": {
                    "start": {
                        "line": 8,
                        "column": 42
                    },
                    "end": {
                        "line": 19,
                        "column": 9
                    }
                }
            },
            "alternate": null,
            "loc": {
                "start": {
                    "line": 8,
                    "column": 8
                },
                "end": {
                    "line": 19,
                    "column": 9
                }
            }
        };
        const declarations = { "conditionConcept": "Concept 1" };

        const condition = "if selected answers for Concept 1 with length greater than or equal to 2";
        const conceptsToHide = "ConceptA";
        const nestedIfondition = "if selected answers for Concept 1 with length greater than or equal to 4";
        const nestedIfConceptsToHide = "ConceptB";
        const nestedElseIfondition = "if selected answers for Concept 1 with length equal to 2";
        const nestedElseIfConceptsToShow = "ConceptT";
        const nestedElseConceptsToShow = "ConceptX";

        binaryExpressionParserStub.onCall( 0 ).returns( "Concept 1 with length equal to 2" );
        binaryExpressionParserStub.onCall( 1 ).returns( "Concept 1 with length greater than or equal to 4" );
        binaryExpressionParserStub.onCall( 2 ).returns( "Concept 1 with length greater than or equal to 2" );
        literalParserStub.onCall(0).returns("ConceptA");
        literalParserStub.onCall(1).returns("ConceptB");
        literalParserStub.onCall(2).returns("ConceptT");
        literalParserStub.onCall(3).returns("ConceptX");

        parserFactoryStub.onCall(0).returns(new LiteralParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        parserFactoryStub.onCall(2).returns(new LiteralParser());
        parserFactoryStub.onCall(3).returns(new LiteralParser());
        parserFactoryStub.onCall(4).returns(new BinaryExpressionParser());
        parserFactoryStub.onCall(5).returns(new BinaryExpressionParser());
        parserFactoryStub.onCall(6).returns(new BinaryExpressionParser());

        const parsedResult = ifStatementParser.parse( data, declarations );

        assert.equal( parsedResult.length, 1 );
        assert.equal( parsedResult[ 0 ].conceptsToHide, conceptsToHide );
        assert.equal( parsedResult[ 0 ].condition, condition );

        const actualNestedConditions = parsedResult[ 0 ].nestedConditions;

        assert.equal( actualNestedConditions.length, 3 );
        assert.equal( actualNestedConditions[ 0 ].conceptsToShow, nestedElseConceptsToShow );
        assert.equal( actualNestedConditions[ 0 ].condition, "" );
        assert.equal( actualNestedConditions[ 1 ].conceptsToShow, nestedElseIfConceptsToShow );
        assert.equal( actualNestedConditions[ 1 ].condition, nestedElseIfondition );
        assert.equal( actualNestedConditions[ 2 ].conceptsToHide, nestedIfConceptsToHide );
        assert.equal( actualNestedConditions[ 2 ].condition, nestedIfondition );
    } );

    it("should parse consequent hide and show within a block statement inside if", () => {
        let data = {
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
                                    "value": "Concept A",
                                    "raw": "\"Concept A\""
                                },
                                {
                                    "type": "Literal",
                                    "value": "Concept B",
                                    "raw": "\"Concept B\""
                                }
                            ]
                        }
                    },
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
                                        "name": "show"
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
                                    "value": "Concept C",
                                    "raw": "\"Concept C\""
                                },
                                {
                                    "type": "Literal",
                                    "value": "Concept D",
                                    "raw": "\"Concept D\""
                                }
                            ]
                        }
                    }
                ]
            },
            "alternate": null
        };
        const declarations = { "conditionConcept": "Concept 1" };

        const condition = "if selected answers for Concept 1 with length greater than or equal to 2";
        const conceptsToHide1 = "Concept A";
        const conceptsToHide2 = "Concept B";
        const conceptsToShow1 = "Concept C";
        const conceptsToShow2 = "Concept D";

        binaryExpressionParserStub.returns( "Concept 1 with length greater than or equal to 2" );
        literalParserStub.onCall(0).returns("Concept A");
        literalParserStub.onCall(1).returns("Concept B");
        literalParserStub.onCall(2).returns("Concept C");
        literalParserStub.onCall(3).returns("Concept D");

        parserFactoryStub.onCall(0).returns(new LiteralParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        parserFactoryStub.onCall(2).returns(new LiteralParser());
        parserFactoryStub.onCall(3).returns(new LiteralParser());
        parserFactoryStub.onCall(4).returns(new BinaryExpressionParser());

        const parsedResult = ifStatementParser.parse( data, declarations );

        assert.equal( parsedResult.length, 1 );

        assert.equal(parsedResult[ 0 ].condition, condition);
        assert.equal( parsedResult[ 0 ].conceptsToHide[ 0 ], conceptsToHide1 );
        assert.equal( parsedResult[ 0 ].conceptsToHide[ 1 ], conceptsToHide2 );
        assert.equal( parsedResult[ 0 ].conceptsToShow[ 0 ], conceptsToShow1 );
        assert.equal( parsedResult[ 0 ].conceptsToShow[ 1 ], conceptsToShow2 );

    });

    it("should parse if statement with return statement as an object expression containing key as enable ", () => {
        let data = {
            "type": "IfStatement",
            "test": {
                "type": "LogicalExpression",
                "operator": "||",
                "left": {
                    "type": "Identifier",
                    "name": "systolic"
                },
                "right": {
                    "type": "Identifier",
                    "name": "diastolic"
                }
            },
            "consequent": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "ReturnStatement",
                        "argument": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "Property",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "enable"
                                    },
                                    "computed": false,
                                    "value": {
                                        "type": "ArrayExpression",
                                        "elements": [
                                            {
                                                "type": "Literal",
                                                "value": "Posture",
                                                "raw": "\"Posture\""
                                            }
                                        ]
                                    },
                                    "kind": "init",
                                    "method": false,
                                    "shorthand": false
                                }
                            ]
                        }
                    }
                ]
            },
            "alternate": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "ReturnStatement",
                        "argument": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "Property",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "disable"
                                    },
                                    "computed": false,
                                    "value": {
                                        "type": "ArrayExpression",
                                        "elements": [
                                            {
                                                "type": "Literal",
                                                "value": "Posture",
                                                "raw": "\"Posture\""
                                            }
                                        ]
                                    },
                                    "kind": "init",
                                    "method": false,
                                    "shorthand": false
                                }
                            ]
                        }
                    }
                ]
            }
        };
        const declarations = { "systolic": "Systolic", "diastolic": "Diastolic" };

        const condition = "if selected answers for Systolic or Diastolic";
        const conceptsToHide = "Posture";
        const conceptsToShow = "Posture";


        logicalExpressionParserStub.returns( "Systolic or Diastolic" );
        literalParserStub.onCall(0).returns("Posture");
        literalParserStub.onCall(1).returns("Posture");

        parserFactoryStub.onCall(0).returns(new LogicalExpressionParser());
        parserFactoryStub.onCall(1).returns(new LiteralParser());
        parserFactoryStub.onCall(2).returns(new LiteralParser());

        const parsedResult = ifStatementParser.parse( data, declarations );

        assert.equal( parsedResult.length, 2 );
        assert.equal(parsedResult[ 1 ].condition, condition);
        assert.equal( parsedResult[ 1 ].conceptsToShow, conceptsToShow );
        assert.equal( parsedResult[ 0 ].conceptsToHide, conceptsToHide );
    });

    it("should replace variable name in concepts to show and hide", () => {
        let data = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": "!=",
                "left": {
                    "type": "Identifier",
                    "name": "suspectCause"
                },
                "right": {
                    "type": "Literal",
                    "value": null,
                    "raw": "null"
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
                                        "name": "enable"
                                    }
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "push"
                                }
                            },
                            "arguments": [
                                {
                                    "type": "Identifier",
                                    "name": "enOther"
                                }
                            ]
                        }
                    }
                ]
            }
        };
        const declarations = { "enOther": "EOT, Other reasons for treatment interruption" };

        parserFactoryStub.onCall(0).returns(new IdentifierParser());
        parserFactoryStub.onCall(1).returns(new BinaryExpressionParser());

        binaryExpressionParserStub.returns("If ConceptA is not equal to null");
        identifierParserStub.returns("EOT, Other reasons for treatment interruption");

        const parsedResult = ifStatementParser.parse( data, declarations );

        assert.equal(parsedResult.length, 1);
        assert.equal(parsedResult[ 0 ].conceptsToShow, "EOT, Other reasons for treatment interruption");
    });
} );
