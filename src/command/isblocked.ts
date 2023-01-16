import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

function getApiUrlWithServerIp(serverIp: string): string {
    return `https://ismyserverblocked.com/check/${serverIp}`;
}

export const data = new SlashCommandBuilder()
    .setName('isblocked')
    .setDescription('Find out whether a Minecraft server is blocked.')
    .addStringOption(
        (option: SlashCommandStringOption) => option
            .setName('ip')
            .setDescription('The IP of the server to check')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const url = interaction.options.getString('ip')!;
    const response = await fetch(getApiUrlWithServerIp(url));
    const json = await response.json();
    if (json.success) {
        if (!json.blocked) {
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
            .setDescription(`The server has been blocked since ${new Date(json.lastBlocked)}.`)
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
}
            
/*module.exports = {
    data: new SlashCommandBuilder()
            .setName('isblocked')
            .setDescription('Find out whether a Minecraft server is blocked.')
            .addStringOption(
                (option: SlashCommandStringOption) => option
                    .setName('ip')
                    .setDescription('The IP of the server to check')
                    .setRequired(true)
            ),
    async execute(interaction: ChatInputCommandInteraction) {
        const url = interaction.options.getString('ip')!;
        const response = await fetch(getApiUrlWithServerIp(url));
        const json = await response.json();
        if (json.success) {
            if (!json.blocked) {
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
                .setDescription(`The server has been blocked since ${new Date(json.lastBlocked)}.`)
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
    }
}*/