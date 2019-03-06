import LogicalExpressionParser from "../../src/parsers/LogicalExpressionParser";
import assert from "assert";

describe("Parse Logical Expression", () => {

    let logicalExpressionParser;

    beforeEach(() => {
        logicalExpressionParser = new LogicalExpressionParser();
    });

    it("should replace || with or", () => {
        let data = {
            "type": "BinaryExpression",
            "left": {
                "type": "Literal",
                "value": 5
            },
            operator: "||",
            "right": {
                "type": "Literal",
                "value": 2
            }
        };

        const parseResult = logicalExpressionParser.parse(data, []);

        assert.equal(parseResult, "5 or  2");
    });

    it("should replace && with and", () => {
        let data = {
            "type": "BinaryExpression",
            "left": {
                "type": "Literal",
                "value": 5
            },
            operator: "&&",
            "right": {
                "type": "Literal",
                "value": 2
            }
        };

        const parseResult = logicalExpressionParser.parse(data, []);

        assert.equal(parseResult, "5 and  2");
    });
});
