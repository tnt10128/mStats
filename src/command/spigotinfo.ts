import * as discordJs from 'discord.js';

function getResourceApiUrlWithResourceId(resourceId: number): string {
    return `https://api.spiget.org/v2/resources/${resourceId}`;
}

function getResourceWebsiteUrlWithResourceId(resourceId: number): string {
    return `https://spigotmc.org/resources/${resourceId}`;
}

export const data = new discordJs.SlashCommandBuilder()
    .setName('spigot')
    .setDescription('View information about a resource on SpigotMC.org.')
    .addIntegerOption((option: discordJs.SlashCommandIntegerOption) =>
        option.setName('id').setDescription('The ID of the resource to check').setRequired(true)
    );
export async function execute(interaction: discordJs.ChatInputCommandInteraction) {
    const id = interaction.options.getInteger('id')!;
    const response = await fetch(getResourceApiUrlWithResourceId(id));
    const json = await response.json();
    if (response.ok) {
        const infoResponse = new discordJs.EmbedBuilder()
            .setColor(discordJs.Colors.Yellow)
            .setTitle(`:green_circle: **Information about "${json.name}"**`)
            .setURL(getResourceWebsiteUrlWithResourceId(id))
            .addFields({ name: 'Resource ID', value: json.id })
            .addFields({ name: 'Downloads', value: json.downloads })
            .addFields({ name: 'Likes', value: `${json.likes} ${json.likes == 0 ? ':(' : ''}` })
            .setThumbnail(`https://spigotmc.org/${json.icon.url}`)
            .setFooter({ text: `Powered by spiget.org` });
        await interaction.reply({ embeds: [infoResponse] });
    } else {
        const errorResponse = new discordJs.EmbedBuilder()
            .setColor(discordJs.Colors.Red)
            .setTitle(':red_circle: **Error!**')
            .setDescription("We couldn't find any info\n about this resource :(");
        await interaction.reply({ embeds: [errorResponse] });
    }
}
