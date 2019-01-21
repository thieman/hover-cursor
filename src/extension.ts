import * as vscode from 'vscode';

interface LastCheck {
	position: vscode.Position;
	time: number;
}

let checkTimer: NodeJS.Timer;
let subscription: vscode.Disposable;
let lastCheck: LastCheck;

function currentPosition(): vscode.Position | undefined {
	const editor = vscode.window.activeTextEditor;

	if (editor !== undefined && editor.selection.isEmpty) {
		return editor.selection.active;
	}
	return undefined;
}

function maybeTriggerHover(): void {
	const position = currentPosition();
	if (position === undefined) { return; }

	const now = Date.now();	

	if (lastCheck === undefined || position !== lastCheck.position) {
		lastCheck = {position, time: now};
		return;
	}

	if (now > lastCheck.time + vscode.workspace.getConfiguration('hover-cursor').delay) {
		console.log('Running hover');
		lastCheck = {position, time: now};
		vscode.commands.executeCommand('editor.action.showHover');		
	}	
}

function startTimer(): void {
	checkTimer = setInterval(maybeTriggerHover, 100);
}

export function activate(context: vscode.ExtensionContext) {
	startTimer();

	subscription = vscode.workspace.onDidChangeConfiguration((event) => {
		clearInterval(checkTimer);
		startTimer();
	});
}

export function deactivate() {
	clearInterval(checkTimer);
	subscription.dispose();
}
