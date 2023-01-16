import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { getUuidByUserName } from './../util/mojang-api.js';

function getSkinApiUrlByUuid(uuid: string): string {
    return `https://visage.surgeplay.com/bust/${uuid}`;
}

function getSkullCommandByUserName(userName: string): string {
    return `/give @p minecraft:player_head{SkullOwner:"${userName}"}`;
}

export const data = new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('View information about a Minecraft Java player.')
    .addStringOption(
        (option: SlashCommandStringOption) => option
            .setName('name')
            .setDescription('The username of the player to check')
            .setRequired(true)
    );
export async function execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name')!;
    try {
        const uuid = await getUuidByUserName(name);
        const infoEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle(`:green_circle: **Info about ${name}**`)
            .setThumbnail(getSkinApiUrlByUuid(uuid))
            .addFields({ name: 'UUID', value: uuid })
            .addFields({ name: 'Skull command', value: getSkullCommandByUserName(name) });
        interaction.reply({ embeds: [infoEmbed] });
    } catch (error) {
        const errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle(':red_circle: **Error**')
            .setDescription(
                'There was an error while looking up this player. Ensure you typed their name correctly.'
            );
        interaction.reply({ embeds: [errorEmbed] });
    }
}