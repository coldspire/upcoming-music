import { allCommands } from './commands.js';

function getCommandMessage(command, commandTree) {
	const commandList = commandTree.join(' ');
	return `💬  \`/music ${commandList}\`: ${command.description}\n`;
}

function getSubMessages(commandOptions, commandTree) {
	let message = '';
	commandOptions.forEach((option) => {
		switch (option.type) {
			case 1: // Subcommand
				message += getCommandMessage(option, [...commandTree, option.name]);
				break;
			case 2: // Subgroup
				message += getSubMessages(option.options, [...commandTree, option.name]);
				break;
		}
	});

	return message;
}

export default function getHelp() {
	let message = `🌚 I currently obey the following commands:\n`;

	allCommands.forEach((command) => {
		if (command.options) {
			message += getSubMessages(command.options, []) + '\n';
		} else {
			message += getCommandMessage([]);
		}

		return message;
	});

	return message;
}
