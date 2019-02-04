Bahmni.ConceptSet.FormConditions.rules = {      //This is a constant that Bahmni expects
    'Baseline, Employment within the past year': function (formName, formFieldValues) {
        var conditions = {enable: [], disable: []};
        var conditionConcept = formFieldValues['Baseline, Employment within the past year'];
        if (conditionConcept == "Other") {
            conditions.enable.push("Baseline, Other employment");
        }
        else {
            conditions.disable.push("Concept D","Concept X");
        }
        return conditions;
    }
}