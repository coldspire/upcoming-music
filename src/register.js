import { MUSIC } from './commands.js';
import dotenv from 'dotenv';
import process from 'node:process';

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server.  It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

dotenv.config({ path: '.dev.vars' });

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
	throw new Error('Missing the required DISCORD_TOKEN environment variable.');
}

if (!applicationId) {
	throw new Error('Missing the required DISCORD_APPLICATION_ID environment variable.');
}

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
const commandsToRegister = [MUSIC];

const response = await fetch(url, {
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bot ${token}`,
	},
	method: 'PUT',
	body: JSON.stringify(commandsToRegister),
});

const registeredCommandsList = commandsToRegister.map(({ name }) => name).join(', ');
if (response.ok) {
	console.log(`Successfully registered these commands: ${registeredCommandsList}`);
	const data = await response.json();
	console.log(JSON.stringify(data, null, 2));
} else {
	console.error(`Failed registering these commands: ${registeredCommandsList}`);
	let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
	try {
		const error = await response.text();
		if (error) {
			errorText = `${errorText} \n\n ${error}`;
		}
	} catch (err) {
		console.error('Error reading body from request:', err);
	}
	console.error(errorText);
}
