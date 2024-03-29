import * as discordJs from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import config from './../config.json' assert { type: 'json' };
import { registerListeners } from './events.js';
import * as logging from './util/logging.js';

class CommandInteractionClient extends discordJs.Client {
    commands: discordJs.Collection<string, Command>;

    constructor(options: discordJs.ClientOptions, commands: discordJs.Collection<string, Command>) {
        super(options);
        this.commands = commands;
    }
}

export const client: CommandInteractionClient = new CommandInteractionClient(
    { intents: discordJs.GatewayIntentBits.Guilds },
    new discordJs.Collection()
);

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, 'command');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

export interface Command {
    data: discordJs.SlashCommandBuilder;
    execute: (interaction: discordJs.ChatInputCommandInteraction) => Promise<unknown>;
}

export function logJoinedGuildCount(): void {
    logging.logInfo(`The bot is in ${client.guilds.cache.size} guilds.`);
}

commandFiles.forEach(async (file: string) => {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(
            `The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
});

logging.logTitle('Loading mStats...');
registerListeners();
client.login(config.token);
