import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits, Collection, Guild, ActivityType, EmbedBuilder, Colors, SlashCommandBuilder } from 'discord.js';
import config from './../config.json' assert { type: 'json' };
import deploy from './deploy-commands.js';
import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';

const client: any = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, 'command');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

export default interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
}

function logJoinedGuildCount() {
    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
}

function createCommandErrorEmbed() {
    return new EmbedBuilder()
        .setTitle('Oops, there was an error with this command!')
        .setColor(Colors.Red);
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

client.once(Events.ClientReady, (client: Client) => {
    if (client.user) {
        console.log(`Successfully logged in as ${client.user.tag}`);
        client.user.setActivity('Minecraft servers', { type: ActivityType.Watching });
        logJoinedGuildCount();
    }
    deploy();
});

client.on(Events.GuildCreate, (guild: Guild) => {
    console.log(`Joined guild: ${guild.name} (ID ${guild.id})`);
    logJoinedGuildCount();
});

client.on(Events.GuildDelete, (guild: Guild) => {
    console.log(`Removed from guild ${guild.name} (ID ${guild.id})`);
    logJoinedGuildCount();
});

client.on(Events.InteractionCreate, async (interaction: ChatInputCommandInteraction) => {
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