import * as discordJs from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import config from './../config.json' assert { type: 'json' };
import deploy from './deploy-commands.js';

const client: any = new discordJs.Client({ intents: discordJs.GatewayIntentBits.Guilds });
client.commands = new discordJs.Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, 'command');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

export default interface Command {
    data: discordJs.SlashCommandBuilder;
    execute: (interaction: discordJs.ChatInputCommandInteraction) => Promise<unknown>;
}

function logJoinedGuildCount() {
    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
}

function createCommandErrorEmbed() {
    return new discordJs.EmbedBuilder()
        .setTitle('Oops, there was an error with this command!')
        .setColor(discordJs.Colors.Red);
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

client.once(discordJs.Events.ClientReady, (client: discordJs.Client) => {
    if (client.user) {
        console.log(`Successfully logged in as ${client.user.tag}`);
        client.user.setActivity('Minecraft servers', { type: discordJs.ActivityType.Watching });
        logJoinedGuildCount();
    }
    deploy();
});

client.on(discordJs.Events.GuildCreate, (guild: discordJs.Guild) => {
    console.log(`Joined guild: ${guild.name} (ID ${guild.id})`);
    logJoinedGuildCount();
});

client.on(discordJs.Events.GuildDelete, (guild: discordJs.Guild) => {
    console.log(`Removed from guild ${guild.name} (ID ${guild.id})`);
    logJoinedGuildCount();
});

client.on(discordJs.Events.InteractionCreate, async (interaction: discordJs.ChatInputCommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ 
            embeds: [createCommandErrorEmbed()], 
            ephemeral: true 
        });
    }
});

client.login(config.token);