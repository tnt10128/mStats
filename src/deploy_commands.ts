import * as discordJs from 'discord.js';
import fs from 'fs';
import { Command } from '.';
import config from '../config.json' assert { type: 'json' };
import * as logging from './util/logging.js';

const commands: Command[] = [];
const commandFiles = fs.readdirSync('./src/command').filter(isFileNameSuitableForCommand);

commandFiles.forEach(async (file: string) => {
    const command = await import(`./command/${file}`);
    commands.push(command.data.toJSON());
});

const rest = new discordJs.REST({ version: '10' }).setToken(config.token);

function isFileNameSuitableForCommand(fileName: string): boolean {
    return /\.(js|ts)$/i.test(fileName);
}

export default async function deploy(): Promise<void> {
    try {
        logging.logInfo('Loading slash commands...');

        await rest.put(discordJs.Routes.applicationCommands(config.clientId), {
            body: commands
        });

        logging.logInfo('Successfully loaded slash commands.');
    } catch (error) {
        console.error(error);
    }
}
