import { Colors, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { getJson } from '../util/network-util';

const BLOCKED_API_URL = 'https://ismyserverblocked.com/check/%ip%';

module.exports = {
    data: new SlashCommandBuilder()
            .setName('isblocked')
            .setDescription('Find out whether a Minecraft server is blocked.')
            .addStringOption(
                (option: SlashCommandStringOption) => option
                    .setName('ip')
                    .setDescription('The IP of the server to check')
                    .setRequired(true)
            ),
    async execute(interaction: any) {
        const url = interaction.options.getString('ip');
        getJson(BLOCKED_API_URL.replace('%ip%', url)).then(async (response: any) => {
            if (response.success) {
                if (!response.blocked) {
                    const unblockedResponse = new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setTitle(`:green_circle: **${url} is not blocked!**`)
                        .setDescription('The server is not being blocked by Mojang currently.')
                        .setFooter({ text: 'Powered by isMyServerBlocked.com' });
                    await interaction.reply({ embeds: [unblockedResponse] });
                } else {
                    const blockedResponse = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(`:red_circle: **${url} is blocked!**`)
                        .setDescription(`The server has been blocked since ${new Date(response.lastBlocked)}.`)
                        .setFooter({ text: 'Powered by isMyServerBlocked.com' });
                    await interaction.reply({ embeds: [blockedResponse] });
                }
            } else {
                const failedResponse = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle(`:red_circle: Failed to check ${url}`)
                    .setDescription(`We could not get any data about this server.`);
                await interaction.reply( { embeds: [failedResponse] })
            }
        });
    }
}