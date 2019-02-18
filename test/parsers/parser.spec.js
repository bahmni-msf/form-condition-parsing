import assert from "assert";
import { parseContent } from "../../src/parsers/parser";
import Logger from "../../src/util/logger";
import sinon from "sinon";
import IfStatementParser from "../../src/parsers/IfStatmentParser";

describe( "Parse form conditons", () => {
    let ifStatementParserStub;

    beforeEach(() => {
        ifStatementParserStub = sinon.stub(IfStatementParser.prototype, "parse");
    });

    afterEach(() => {
        ifStatementParserStub.restore();
    });

    it( "should be able to parse and return the result for the parsed conditions", () => {
        const content = "Bahmni.ConceptSet.FormConditions.rules = {      \/\/This is a constant " +
            "that Bahmni expects\r\n \'Baseline, Employment within the past year\': function (formName, " +
            "formFieldValues) {\r\n        " + "var conditions = {enable: [], disable: []};\r\n        var " +
            "conditionConcept = formFieldValues[\'Baseline, " + "Employment within the past year\'];\r\n        " +
            "if (conditionConcept == \"Other\") {\r\n           " + " conditions.enable.push(\"Baseline, " +
            "Other employment\");\r\n        }\r\n        else {\r\n           " +
            " conditions.disable.push(\"Concept " +
            "D\",\"Concept X\");\r\n        }\r\n        " + "return conditions;\r\n    }\r\n}";
        const condition = "if selected answers for Baseline, Employment within the" +
            " past year is equal to Other";

        let conceptsToShow = [ "Baseline, Other employment" ];

        let conceptsToHide = [ "Concept D", "Concept X" ];

        ifStatementParserStub.returns([ {
            condition: condition,
            conceptsToShow,
            nestedConditions: []
        }, {
            condition: "",
            conceptsToHide,
            nestedConditions: []
        } ]);

        const finaltree = parseContent( content );
        const parsedContent = finaltree[ "Baseline, Employment within the past year" ];


        assert.equal( parsedContent[ 0 ].condition, condition );
        assert.equal( parsedContent[ 0 ].nestedConditions.length, 0 );
        assert.equal( parsedContent[ 0 ].conceptsToShow, conceptsToShow );
        assert.equal( parsedContent[ 1 ].condition, "" );
        assert.equal( parsedContent[ 1 ].conceptsToHide[ 0 ], conceptsToHide[ 0 ] );
        assert.equal( parsedContent[ 1 ].conceptsToHide[ 1 ], conceptsToHide[ 1 ] );
    } );

    it("should parse & pass declarations to IfStatement parser", () => {
        const content = "Bahmni.ConceptSet.FormConditions.rules = {\r\n    \"FSTG, Outcomes for 1st stage " +
            "surgical validation\": function(formName, formFieldValues) {\r\n        let conditions = {\r\n   " +
            "         show: [],\r\n            hide: []\r\n        };\r\n        let conditionConcept = " +
            "formFieldValues[ \"FSTG, Outcomes for 1st stage surgical validation\" ];\r\n       " +
            " if(conditionConcept)\r\n            conditions.hide.push(conditionConcept);\r\n       " +
            " return conditions;\r\n    }\r\n};\r\n";

        parseContent(content);

        assert.equal(ifStatementParserStub.args[ 0 ][ 1 ].conditionConcept,
            "FSTG, Outcomes for 1st stage surgical validation");
    });

    it("should call IfStatementParser twice for the 2 root if statements", () => {
        const content = "Bahmni.ConceptSet.FormConditions.rules = {\r\n    \"FSTG, Outcomes for 1st stage " +
            "surgical validation\": function(formName, formFieldValues) {\r\n        let conditions = {\r\n      " +
            "      show: [],\r\n            hide: []\r\n        };\r\n        let conditionConcept = " +
            "formFieldValues[ \"FSTG, Outcomes for 1st stage surgical validation\" ];\r\n\r\n     " +
            "   if (conditionConcept) {\r\n            if (conditionConcept) {\r\n        " +
            "        conditions.hide.push(conditionConcept);\r\n            }\r\n        }\r\n   " +
            "     if (conditionConcept) {\r\n            conditions.hide.push(conditionConcept);\r\n        }\r\n " +
            "       return conditions;\r\n    }\r\n};\r\n";

        parseContent(content);
        assert.equal(ifStatementParserStub.calledTwice, true);
    });
} );

describe("Exception Handling", () => {
    let warnLoggerStub, errorLoggerStub;

    beforeEach(() => {
        warnLoggerStub = sinon.stub(Logger, "warn");
        errorLoggerStub = sinon.stub(Logger, "error");
    });
    afterEach(() => {
        warnLoggerStub.restore();
        errorLoggerStub.restore();
    });
    it("should warn when the parsed data is empty", () => {
        const content = "Bahmni.ConceptSet.FormConditions.rules = {\r\n    \"FSTG, Outcomes for 1st stage " +
            "surgical validation\": function(formName, formFieldValues) {\r\n        let conditions = {\r\n     " +
            "       show: [],\r\n            hide: []\r\n        };\r\n        let conditionConcept = " +
            "formFieldValues[ \"FSTG, Outcomes for 1st stage surgical validation\" ];\r\n        " +
            "switch (conditionConcept) {\r\n            case \"abc\": break;\r\n            default: break;\r\n" +
            "        }\r\n        return conditions;\r\n    }\r\n};\r\n";

        parseContent( content );

        assert.equal(warnLoggerStub.called, true);
    });

    it("should log error when the expression do not have handler", () => {
        const content = "Bahmni.ConceptSet.FormConditions.rules = {\r\n    \"FSTG, Outcomes for 1st stage " +
            "surgical validation\": function(formName, formFieldValues) {\r\n        let conditions = {\r\n      " +
            "      show: [],\r\n            hide: []\r\n        };\r\n        let conditionConcept = " +
            "formFieldValues[ \"FSTG, Outcomes for 1st stage surgical validation\" ];\r\n        let count= 0;" +
            "\r\n        if (count-- == 0) {\r\n            \r\n        }\r\n        return conditions;\r\n    " +
            "}\r\n};\r\n";

        parseContent(content);

        assert.equal(errorLoggerStub.called, true);
    });
});
