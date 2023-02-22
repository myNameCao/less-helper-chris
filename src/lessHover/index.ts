import * as vscode from "vscode";
import utils from "../utils";
const rgba = require('color-rgba');
var rgb2hex = require('rgb2hex');



const provideHover = async (
  document: vscode.TextDocument,
  position: vscode.Position
) => {
  let  word = document.getText(document.getWordRangeAtPosition(position));

  // if (!word.startsWith("@") ) {
  //  return;
  // }
   // 文件路径
   const allFile = utils.getLocations(document) || [];

   // 汇总所有变量
   const allVars = utils.getVarsByFiles(allFile);
 
   const allDepVars = utils.getDepVars(allVars);
  // TODO: VUE 文件需要兼容
   let  varitem= allDepVars[word]||allDepVars['@'+word];
  if (varitem) {
    const lastColor = varitem[varitem.length - 1].value;

    if(!word.startsWith("@")){
      word= '@'+word;
    }

     const values = rgba(lastColor);
     let color= '#FFF';
     if(values.length){
      let   [r, g, b, alpha]= values;
       let {hex}=rgb2hex(`rgba(${r},${g},${b},${alpha})`);
       color= hex;

     }
   
    const markdown = new vscode.MarkdownString( `${word} : &nbsp;<span style="color:${color};background-color:#000;">
    &nbsp;&nbsp;&nbsp; ${lastColor} &nbsp;&nbsp;&nbsp;</span> `);
    markdown.isTrusted = true;
    return new vscode.Hover(markdown);
  }
};

export default function lessCompletion(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(["less", "vue"], { provideHover })
  );
}
