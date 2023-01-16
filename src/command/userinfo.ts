import * as discordJs from 'discord.js';
import { getUuidByUserName } from './../util/mojang-api.js';

function getSkinApiUrlByUuid(uuid: string): string {
    return `https://visage.surgeplay.com/bust/${uuid}`;
}

function getSkullCommandByUserName(userName: string): string {
    return `/give @p minecraft:player_head{SkullOwner:"${userName}"}`;
}

export const data = new discordJs.SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('View information about a Minecraft Java player.')
    .addStringOption(
        (option: discordJs.SlashCommandStringOption) => option
            .setName('name')
            .setDescription('The username of the player to check')
            .setRequired(true)
    );
export async function execute(interaction: discordJs.ChatInputCommandInteraction) {
    const name = interaction.options.getString('name')!;
    try {
        const uuid = await getUuidByUserName(name);
        const infoEmbed = new discordJs.EmbedBuilder()
            .setColor(discordJs.Colors.Green)
            .setTitle(`:green_circle: **Info about ${name}**`)
            .setThumbnail(getSkinApiUrlByUuid(uuid))
            .addFields({ name: 'UUID', value: uuid })
            .addFields({ name: 'Skull command', value: getSkullCommandByUserName(name) });
        interaction.reply({ embeds: [infoEmbed] });
    } catch (error) {
        const errorEmbed = new discordJs.EmbedBuilder()
            .setColor(discordJs.Colors.Red)
            .setTitle(':red_circle: **Error**')
            .setDescription(
                'There was an error while looking up this player. Ensure you typed their name correctly.'
            );
        interaction.reply({ embeds: [errorEmbed] });
    }
}