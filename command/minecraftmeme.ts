import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getRandomMeme } from '@blad3mak3r/reddit-memes';

function getRedditUrlById(id: string, subreddit: string) {
    return `https://www.reddit.com/r/${subreddit}/comments/${id}`;
}

const MINECRAFT_MEMES_SUBREDDIT = 'minecraftmemes';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Sends a random Minecraft meme.'),
    async execute(interaction: any) {
        const meme = await getRandomMeme(MINECRAFT_MEMES_SUBREDDIT);
        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(meme.title.substring(0, 256))
            .setURL(getRedditUrlById(meme.id, meme.subreddit))
            .setImage(meme.image)
            .setAuthor({ name: `${meme.ups} ⬆️ | ${meme.comments} 💬` })
            .setFooter({ text: `Posted on r/${meme.subreddit} by u/${meme.author}` })
        return await interaction.reply({ embeds: [embed] });
    }
}