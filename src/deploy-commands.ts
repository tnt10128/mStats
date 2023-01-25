import * as discordJs from 'discord.js';
import fs from 'fs';
import Command from '.';
import config from './../config.json' assert { type: 'json' };

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

export default async function deploy() {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data: any = await rest.put(discordJs.Routes.applicationCommands(config.clientId), {
            body: commands
        });

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}
