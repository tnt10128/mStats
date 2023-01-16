import * as discordJs from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import config from './../config.json' assert { type: 'json' };
import { registerListeners } from './events.js';

export const client: any = new discordJs.Client({ intents: discordJs.GatewayIntentBits.Guilds });
client.commands = new discordJs.Collection();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, 'command');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

export default interface Command {
    data: discordJs.SlashCommandBuilder;
    execute: (interaction: discordJs.ChatInputCommandInteraction) => Promise<unknown>;
}

export function logJoinedGuildCount() {
    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
}

commandFiles.forEach(async (file: string) => {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
});

registerListeners();
client.login(config.token);