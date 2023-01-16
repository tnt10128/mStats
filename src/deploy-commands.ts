import { REST, Routes } from 'discord.js';
import config from './../config.json' assert { type: 'json' };
import Command from './index';
import fs from 'fs';

const commands: Command[] = [];
const commandFiles = fs.readdirSync('./src/command').filter((file: string) => file.endsWith('.ts'));

commandFiles.forEach(async (file: string) => { 
    const command = await import(`./command/${file}`);
    commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(config.token);

export default async function deploy() {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        const data: any = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );
            
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}