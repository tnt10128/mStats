import * as discordJs from 'discord.js';
import { logJoinedGuildCount } from '../index.js';
import * as logging from '../util/logging.js';

export const event = discordJs.Events.GuildCreate;
export const once = false;

export async function execute(guild: discordJs.Guild): Promise<void> {
    logging.logInfo(`Joined guild ${guild.name} with ID of ${guild.id}.`);
    logJoinedGuildCount();
}
