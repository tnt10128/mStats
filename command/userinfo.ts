import { AttachmentBuilder, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { getUuidByUserName } from '../util/mojang-api';

const SKIN_API_URL = 'https://visage.surgeplay.com/bust/%uuid%';
const SKULL_COMMAND_FORMAT = '/give @p minecraft:player_head{SkullOwner:"%name%"}'

module.exports = {
    data: new SlashCommandBuilder()
            .setName('userinfo')
            .setDescription('View information about a Minecraft Java player.')
            .addStringOption((option: SlashCommandStringOption) => option.setName('name')
                                        .setDescription('The username of the player to check')
                                        .setRequired(true)),
    async execute(interaction: any) {
        const name = interaction.options.getString('name');
        try {
            const uuid = await getUuidByUserName(name);
            const infoEmbed = new EmbedBuilder()
                                    .setColor(Colors.Green)
                                    .setTitle(`:green_circle: **Info about ${name}**`)
                                    .setThumbnail(`${SKIN_API_URL.replace('%uuid%', uuid)}`)
                                    .addFields({ name: 'UUID', value: uuid })
                                    .addFields({ name: 'Skull command', value: SKULL_COMMAND_FORMAT.replace(`%name%`, name) });
            interaction.reply({ embeds: [infoEmbed] });
        } catch (error: any) {
            const errorEmbed = new EmbedBuilder()
                                    .setColor(Colors.Red)
                                    .setTitle(':red_circle: **Error**')
                                    .setDescription('There was an error while looking up this player. Ensure you typed their name correctly.');
            interaction.reply({ embeds: [errorEmbed] });
        }
    }
}