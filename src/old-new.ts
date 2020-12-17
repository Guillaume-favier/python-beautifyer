// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch, { Response } from "node-fetch";
import * as shell from "shelljs"
import * as fs from 'fs';
let myStatusBarItem: vscode.StatusBarItem;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function inityapf(){
	if (shell.which('yapf')){
		shell.exec('pip3 install yapf')
	}
}

let myCommandId ='python-beautify.beautifylikeall'

inityapf()
let old=''
if (process.platform.startsWith('win')){
	if ((typeof process.env.HOMEDRIVE !== 'undefined') &&  (typeof process.env.HOMEPATH !== 'undefined')){
		old += process.env.USERPROFILE +'\\.python-beautifyer-tmp.py'
		config.execPath=process.env.USERPROFILE
	}
}else{
	old += process.env.HOME+'/.python-beautifyer-tmp.py'
}
let pathtmp=String(old)
console.log(pathtmp)
function pretifypyth(meth:any=0){
	const editor = vscode.window.activeTextEditor
	if(!editor){
		return
	}
	let text = ''
	if(meth==0){
		if(editor.document.getText(editor.selection) != ''){
			text += editor.document.getText(editor.selection)
			meth = 1
		}else{
			text += editor.document.getText()
			meth = 2
		}
	}else if(meth==1){
		text += editor.document.getText(editor.selection)
	}else{
		text += editor.document.getText()
	}
	vscode.window.showInformationMessage(text)
	fs.writeFileSync(pathtmp,text)
	console.log(1)
	var resp = shell.exec('yapf '+pathtmp)
	console.log(resp)
	vscode.window.showInformationMessage(resp)
	if(resp.code != 0){
		vscode.window.showErrorMessage('They is one or more errors in your code.')
		vscode.window.showErrorMessage('errors : '+resp)
	}else{
        if(meth == 1){
            editor.edit(edit=>{
                edit.replace(editor.selection, resp)
            })
        }else{
            editor.edit(edit=>{
				var firstLine = editor.document.lineAt(0);
				var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
				var textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                edit.delete(textRange);
                edit.insert(new vscode.Position(0,0),resp)
            })
        }
	}//fs.unlinkSync('./.python-beautifyer-tmp.py')
}

export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "python-beautify" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('python-beautify.beautifyfromselec', async () => {
		// The code you place here will be executed every time your command is executed
		
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor
		if(!editor){
			vscode.window.showErrorMessage('You\'re not on a codding page')
		}else{
			pretifypyth(1)
		}
	});

	context.subscriptions.push(disposable);
	let disposable2 = vscode.commands.registerCommand('python-beautify.beautifyfromallpage', async () => {
		// The code you place here will be executed every time your command is executed
		
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor
		if(!editor){
			vscode.window.showInformationMessage('You\'re not on a codding page')
		}else{
			pretifypyth(2)
		}
		

	});

	context.subscriptions.push(disposable2);
	let disposable3 = vscode.commands.registerCommand('python-beautify.beautifylikeall', async () => {
		// The code you place here will be executed every time your command is executed
		
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor
		if(!editor){
			vscode.window.showInformationMessage('You\'re not on a codding page')
		}else{
			pretifypyth(0)
		}
		

	});

	context.subscriptions.push(disposable3);
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	context.subscriptions.push(myStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	myStatusBarItem.text = `python beautifyer`;
	myStatusBarItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() {}
