import * as discordJs from 'discord.js';

function getStatusApiUrlWithServerIp(serverIp: string): string {
    return `https://api.mcsrvstat.us/2/${serverIp}`;
}

function getStatusWebsiteUrlWithServerIp(serverIp: string): string {
    return `https://mcsrvstat.us/server/${serverIp}`;
}

export const data = new discordJs.SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('View information about an online Minecraft server.')
    .addStringOption(
        (option: discordJs.SlashCommandStringOption) => option
            .setName('ip')
            .setDescription('The IP of the server to check')
            .setRequired(true)
    );

export async function execute(interaction: discordJs.ChatInputCommandInteraction) {
    const serverIp = interaction.options.getString('ip')!;
    const apiUrl = getStatusApiUrlWithServerIp(serverIp);
    const response = await fetch(apiUrl);
    const json = await response.json();
    if (json.online) {
        const onlineResponse = new discordJs.EmbedBuilder()
            .setColor(discordJs.Colors.Green)
            .setTitle(`:green_circle: **${serverIp} is online!**`)
            .setDescription(
                `${json.players.online}/${json.players.max} players connected`
            )
            .addFields({ name: 'Version', value: json.version, inline: true })
            .addFields({ 
                name: 'MOTD', 
                value: `${json.motd.clean.join('\n')}` 
            })
            .setURL(getStatusWebsiteUrlWithServerIp(serverIp))
            .setFooter({ text: `Powered by mcSrvStat.us` });
        if (json.icon) {
            const fav = json.icon.split(',').slice(1).join(',');
            const imageStream = Buffer.from(fav, 'base64');
            const attachment = new discordJs.AttachmentBuilder(imageStream, { name: 'favicon.png' }); 
            onlineResponse.setThumbnail('attachment://favicon.png');
            await interaction.reply({ embeds: [onlineResponse], files: [attachment] });
            return;
        }
        await interaction.reply({ embeds: [onlineResponse] });
    } else {
        const offlineResponse = new discordJs.EmbedBuilder()
            .setColor(discordJs.Colors.Red)
            .setTitle(`:red_circle: **${interaction.options.getString('ip')} is offline.**`)
            .setDescription('We could not get any data about this server.');
        await interaction.reply({ embeds: [offlineResponse] });
    }
}