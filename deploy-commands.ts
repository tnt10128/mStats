import { REST, Routes } from 'discord.js';
import { clientId, token } from './config.json';
import fs from 'fs';

const commands: any[] = [];
const commandFiles = fs.readdirSync('./command').filter((file: string) => file.endsWith('.ts'));

commandFiles.forEach((file: string) => { 
    const command = require(`./command/${file}`);
    commands.push(command.data.toJSON());
})

const rest = new REST({ version: '10' }).setToken(token);

export default async function deploy() {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        const data: any = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
            );
            
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    }