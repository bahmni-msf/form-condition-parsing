import assert from "assert";
import { parseContent } from "../src/parser";

describe( "Parse form conditons", () => {
    it( "should be able to parse and return the result for a single if statement", () => {
        let content = "Bahmni.ConceptSet.FormConditions.rules " + "= {\r\n    \'FSTG, Outcomes for 1st stage surgical" +
            " validation\'" + ": function FSTGOutcomesFor1stStageSurgicalValidation(formName, formFieldValues)" +
            " {\r\n        var conditions = {\r\n            show: [],\r\n            hide: []\r\n        };" +
            "\r\n        var conditionConcept = formFieldValues[\'Concept 1\'];\r\n        " +
            "if (conditionConcept.length >= 2) {\r\n           " +
            "conditions.hide.push(\"ConceptA\");\r\n        }\r\n    }\r\n}",
            finaltree = parseContent( content ),
            parsedContent = finaltree[ "FSTG, Outcomes for 1st stage surgical validation" ];

        assert.equal( parsedContent[ 0 ].condition, "if selected answers for Concept 1 with length greater than " +
            "or equal to 2" );
        assert.equal( parsedContent[ 0 ].nestedConditions.length, 0 );
        assert.equal( parsedContent[ 0 ].conceptsToHide, "ConceptA" );
    } );

    it( "should be able to parse and return the result for a single if statement in multiple concept", () => {
        let content = "\'use strict\';\r\n\r\nBahmni.ConceptSet.FormConditions.rules = { \/\/This is a constant " +
            "that Bahmni expects\r\n    \'Baseline, Employment within the past year\': function " +
            "BaselineEmploymentWithinThePastYear(formName, formFieldValues) {\r\n        " +
            "var conditions = { enable: [], disable: [] };\r\n        var conditionConcept =" +
            " formFieldValues[\'Baseline, Employment within the past year\'];\r\n        " +
            "if (conditionConcept == \"Other\") {\r\n            conditions.enable.push(\"Baseline, " +
            "Other employment\");\r\n        }\r\n        return conditions;\r\n    },\r\n    \'Baseline, Prison\':" +
            " function BaselinePrison(formName, formFieldValues) {\r\n        var " +
            "conditions = { enable: [], disable: [] };\r\n        var conditionConcept = formFieldValues[\'Baseline, "
            + "Prison\'];\r\n        if (conditionConcept == \"True\") {\r\n            conditions.enable." +
            "push(\"Baseline, Is prison past or present\");\r\n        }\r\n        return conditions;\r\n    }\r\n};",
            finaltree = parseContent( content ),
            parsedContent1 = finaltree[ "Baseline, Employment within the past year" ],
            parsedContent2 = finaltree[ "Baseline, Prison" ];

        assert.equal( parsedContent1[ 0 ].condition, "if selected answers for Baseline, Employment within the past" +
            " year is equal to Other" );
        assert.equal( parsedContent1[ 0 ].nestedConditions.length, 0 );
        assert.equal( parsedContent1[ 0 ].conceptsToShow, "Baseline, Other employment" );
        assert.equal( parsedContent2[ 0 ].condition, "if selected answers for Baseline, Prison is equal to True" );
        assert.equal( parsedContent2[ 0 ].nestedConditions.length, 0 );
        assert.equal( parsedContent2[ 0 ].conceptsToShow, "Baseline, Is prison past or present" );
    } );

    it( "should be able to parse and return the result for a if else statement", () => {
        let content = "Bahmni.ConceptSet.FormConditions.rules = {      \/\/This is a constant " +
            "that Bahmni expects\r\n \'Baseline, Employment within the past year\': function (formName, " +
            "formFieldValues) {\r\n        " + "var conditions = {enable: [], disable: []};\r\n        var " +
            "conditionConcept = formFieldValues[\'Baseline, " + "Employment within the past year\'];\r\n        " +
            "if (conditionConcept == \"Other\") {\r\n           " + " conditions.enable.push(\"Baseline, " +
            "Other employment\");\r\n        }\r\n        else {\r\n           " +
            " conditions.disable.push(\"Concept " +
            "D\",\"Concept X\");\r\n        }\r\n        " + "return conditions;\r\n    }\r\n}",
            finaltree = parseContent( content ),
            parsedContent = finaltree[ "Baseline, Employment within the past year" ];

        assert.equal( parsedContent[ 1 ].condition, "if selected answers for Baseline, Employment within the" +
            " past year is equal to Other" );
        assert.equal( parsedContent[ 1 ].nestedConditions.length, 0 );
        assert.equal( parsedContent[ 1 ].conceptsToShow, "Baseline, Other employment" );
        assert.equal( parsedContent[ 0 ].condition, "" );
        assert.equal( parsedContent[ 0 ].conceptsToHide[ 0 ], "Concept D" );
        assert.equal( parsedContent[ 0 ].conceptsToHide[ 1 ], "Concept X" );
    } );
} );
