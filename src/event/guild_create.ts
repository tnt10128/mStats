import * as discordJs from 'discord.js';
import { logJoinedGuildCount } from '../index.js';

export const event = discordJs.Events.GuildCreate;
export const once = false;

export async function execute(guild: discordJs.Guild): Promise<void> {
    console.log(`Joined guild ${guild.name} (ID ${guild.id})`);
    logJoinedGuildCount();
}
