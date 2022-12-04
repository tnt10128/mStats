import { AttachmentBuilder, Colors, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { getJson } from '../util/network-util';

const STATUS_API_URL = 'https://api.mcsrvstat.us/2/%ip%';
const STATUS_USER_URL = 'https://mcsrvstat.us/server/%ip%'

module.exports = {
    data: new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('View information about an online Minecraft server.')
            .addStringOption((option: SlashCommandStringOption) => option.setName('ip')
                                        .setDescription('The IP of the server to check')
                                        .setRequired(true)),
    async execute(interaction: any) {
        const url = interaction.options.getString('ip');
        getJson(STATUS_API_URL.replace('%ip%', url)).then(async (response: any) => {
            if (response.online) {
                const onlineResponse = new EmbedBuilder()
                                            .setColor(Colors.Green)
                                            .setTitle(`:green_circle: **${url} is online!**`)
                                            .setDescription(`${response.players.online}/${response.players.max} players connected`)
                                            .addFields({ name: 'Version', value: response.version, inline: true })
                                            .addFields({ name: 'MOTD', value: `${response.motd.clean[0]}\n${response.motd.clean[1]}` })
                                            .setURL(STATUS_USER_URL.replace('%ip%', url))
                                            .setFooter({ text: `Powered by mcSrvStat.us` });
                if (response.icon) {
                    const fav = response.icon.split(',').slice(1).join(',');
                    const imageStream = Buffer.from(fav, 'base64');
                    const attachment = new AttachmentBuilder(imageStream, { name: 'favicon.png' });
    
                    onlineResponse.setThumbnail('attachment://favicon.png');
                    await interaction.reply({ embeds: [onlineResponse], files: [attachment] });
                    return;
                }
                onlineResponse
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