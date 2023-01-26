import * as discordJs from 'discord.js';
import * as hive from '../util/hive-api.js';

export const data = new discordJs.SlashCommandBuilder()
    .setName('hive')
    .setDescription('View information about a Hive Bedrock player.')
    .addStringOption((option: discordJs.SlashCommandStringOption) =>
        option
            .setName('name')
            .setDescription('The username of the player to check')
            .setRequired(true)
    );

export async function execute(interaction: discordJs.ChatInputCommandInteraction) {
    const user = interaction.options.getString('name')!;

    const skywarsStats = await hive.getStats<hive.SkyWarsStatistics>(user, 'sky');
    const treasureWarsStats = await hive.getStats<hive.TreasureWarsStatistics>(user, 'wars');
    const deathRunStats = await hive.getStats<hive.DeathRunStatistics>(user, 'dr');
    const sgStats = await hive.getStats<hive.SurvivalGamesStatistics>(user, 'sg');

    if (!skywarsStats && !treasureWarsStats && !deathRunStats && !sgStats) {
        const errorEmbed = new discordJs.EmbedBuilder()
            .setColor(discordJs.Colors.Red)
            .setTitle(':red_circle: **Error**')
            .setDescription(
                'There was an error while looking up this player. Ensure you typed their name correctly.'
            );
        return await interaction.reply({ embeds: [errorEmbed] });
    }

    const statsEmbed = new discordJs.EmbedBuilder()
        .setColor(discordJs.Colors.Gold)
        .setTitle(`:green_circle: HiveMC stats of ${user}`)
        .addFields({
            name: 'SkyWars',
            value: `${skywarsStats?.kills ?? 0} kills / ${skywarsStats?.victories ?? 0} wins`,
            inline: true
        })
        .addFields({
            name: 'Treasure Wars',
            value: `${treasureWarsStats?.kills ?? 0} kills / ${
                treasureWarsStats?.victories ?? 0
            } wins`,
            inline: true
        })
        .addFields({
            name: 'Death Run',
            value: `${deathRunStats?.checkpoints ?? 0} checkpoints / ${
                deathRunStats?.victories ?? 0
            } wins`,
            inline: true
        })
        .addFields({
            name: 'Survival Games',
            value: `${sgStats?.kills ?? 0} kills / ${sgStats?.victories ?? 0} wins`,
            inline: true
        });

    return await interaction.reply({ embeds: [statsEmbed] });
}
