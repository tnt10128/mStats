import { ChatInputCommandInteraction, AttachmentBuilder, Colors, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { getJson } from '../util/network-util';

function getStatusApiUrlWithServerIp(serverIp: string): string {
    return `https://api.mcsrvstat.us/2/${serverIp}`;
}

function getStatusWebsiteUrlWithServerIp(serverIp: string): string {
    return `https://mcsrvstat.us/server/${serverIp}`;
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('View information about an online Minecraft server.')
            .addStringOption(
                (option: SlashCommandStringOption) => option
                    .setName('ip')
                    .setDescription('The IP of the server to check')
                    .setRequired(true)
            ),
    async execute(interaction: ChatInputCommandInteraction) {
        const url = interaction.options.getString('ip')!;
        getJson(getStatusApiUrlWithServerIp(url)).then(async (response: any) => {
            if (response.online) {
                const onlineResponse = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle(`:green_circle: **${url} is online!**`)
                    .setDescription(
                        `${response.players.online}/${response.players.max} players connected`
                    )
                    .addFields({ name: 'Version', value: response.version, inline: true })
                    .addFields({ 
                        name: 'MOTD', 
                        value: `${response.motd.clean.join('\n')}` 
                    })
                    .setURL(getStatusWebsiteUrlWithServerIp(url))
                    .setFooter({ text: `Powered by mcSrvStat.us` });
                if (response.icon) {
                    const fav = response.icon.split(',').slice(1).join(',');
                    const imageStream = Buffer.from(fav, 'base64');
                    const attachment = new AttachmentBuilder(imageStream, { name: 'favicon.png' });
    
                    onlineResponse.setThumbnail('attachment://favicon.png');
                    await interaction.reply({ embeds: [onlineResponse], files: [attachment] });
                    return;
                }
                await interaction.reply({ embeds: [onlineResponse] });
            } else {
                const offlineResponse = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle(`:red_circle: **${interaction.options.getString('ip')} is offline.**`)
                    .setDescription('We could not get any data about this server.');
                await interaction.reply({ embeds: [offlineResponse] });
            }
        });
    }
}