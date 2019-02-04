import {getParser} from './ParserFactory';
import IfStatmentParser from './IfStatmentParser';
import fs from 'fs';
var esprima = require("esprima");
var estraverse = require('estraverse')

function createAst(content) {
    try {
      return esprima.parse(content, { loc: true });
    } catch (e) {
      console.error(e.message);
      return "";
    }
  }

function parseVariableDeclaration(node,declarations){
   if(node.declarations[0].init.property)
        declarations[node.declarations[0].id.name] = node.declarations[0].init.property.value;
}

export function parseContent(content){
    // let filePath = __dirname  + '/formConditions.js'
    // content= fs.readFileSync(filePath, 'utf-8');
    let ast = createAst(content);
  // console.log(JSON.stringify(ast));
    let finalParsedTree ={};
    let declarations= {};
    let filteredAst = ast.body.filter(bodyElement => bodyElement.type === 'ExpressionStatement'
        && bodyElement.expression.type === 'AssignmentExpression'
        && bodyElement.expression.left.property.name === 'rules');
    filteredAst[0].expression.right.properties.forEach(concept => {
        let currentConceptName;
        let parsedDataList=[];
        estraverse.traverse(concept, {
            enter: function (node) {
                let parser = getParser(node.type);
                currentConceptName = concept.key.value;
                if (node.type === 'VariableDeclaration') {
                    parseVariableDeclaration(node, declarations);
                }
                if (parser && node.type === 'IfStatement') {
                    parsedDataList.push(new IfStatmentParser().parse(node, declarations));
                    if(node.alternate && node.alternate.type === 'BlockStatement'){
                        let { conceptsToHide, conceptsToShow}  = new IfStatmentParser().parseBlock(node.alternate)
                        parsedDataList.push({conceptsToHide, conceptsToShow, condition:''});
                    }
                }
            }
        });
        finalParsedTree[currentConceptName] = parsedDataList
    });
    
   
    return finalParsedTree;
}

//parseContent();



  