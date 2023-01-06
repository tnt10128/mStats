import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder, SlashCommandIntegerOption } from 'discord.js';
import { get } from '../util/network-util';

function getResourceApiUrlWithResourceId(resourceId: number): string {
    return `https://api.spiget.org/v2/resources/${resourceId}`;
}

function getResourceWebsiteUrlWithResourceId(resourceId: number): string {
    return `https://spigotmc.org/resources/${resourceId}`;
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('spigot')
            .setDescription('View information about a resource on SpigotMC.org.')
            .addIntegerOption(
                (option: SlashCommandIntegerOption) => option
                    .setName('id')
                    .setDescription('The ID of the resource to check')
                    .setRequired(true)
            ),
    async execute(interaction: ChatInputCommandInteraction) {
        const id = interaction.options.getInteger('id')!;
        get(getResourceApiUrlWithResourceId(id)).then(async response => {
            const json = await response.json();
            if (response.ok) {
                const infoResponse = new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setTitle(`:green_circle: **Information about "${json.name}"**`)
                    .setURL(getResourceWebsiteUrlWithResourceId(id))
                    .addFields({ name: 'Resource ID', value: `${json.id}` })
                    .addFields({ name: 'Downloads', value: `${json.downloads}` })
                    .addFields({ name: 'Likes', value: `${json.likes} ${json.likes == 0 ? ":(" : ""}` })
                    .setThumbnail(`https://spigotmc.org/${json.icon.url}`)
                    .setFooter({ text: `Powered by spiget.org` });
                await interaction.reply({ embeds: [infoResponse] });
            } else {
                const errorResponse = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle(':red_circle: **Error!**')
                    .setDescription('We couldn\'t find any info\n about this resource :(');
                await interaction.reply({ embeds: [errorResponse] });
            }
        });
    }
}