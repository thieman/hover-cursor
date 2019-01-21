import * as vscode from 'vscode';

let timer: NodeJS.Timer;
let subscription: vscode.Disposable;

function startTimer(): void {
	timer = setInterval(() => { vscode.commands.executeCommand('editor.action.showHover'); },
			vscode.workspace.getConfiguration('hover-cursor').delay);
}

export function activate(context: vscode.ExtensionContext) {
	startTimer();

	subscription = vscode.workspace.onDidChangeConfiguration((event) => {
		clearInterval(timer);
		startTimer();
	});
}

export function deactivate() {
	clearInterval(timer);
	subscription.dispose();
}
