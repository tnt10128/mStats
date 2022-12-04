const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
import fs from 'fs';

const commands: any[] = [];
const commandFiles = fs.readdirSync('./command').filter((file: String) => file.endsWith('.ts'));

for (const file of commandFiles) {
	const command = require(`./command/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

export default async function deploy() {
    try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}