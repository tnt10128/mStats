import * as discordJs from 'discord.js';
import { client } from '../index.js';

function createCommandErrorEmbed(): discordJs.EmbedBuilder {
    return new discordJs.EmbedBuilder()
        .setTitle('Oops, there was an error with this command!')
        .setColor(discordJs.Colors.Red);
}

export const event = discordJs.Events.InteractionCreate;
export const once = false;

export async function execute(interaction: discordJs.ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
        return;
    }
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
}
