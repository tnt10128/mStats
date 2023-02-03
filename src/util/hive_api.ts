const API_URL = 'https://api.playhive.com/v0';

interface HiveStatistic {
    UUID: string;
    xp: number;
    played: number;
    victories: number;
    first_played: number;
}

export interface SkyWarsStatistics extends HiveStatistic {
    kills: number;
    mystery_chests_destroyed: number;
    ores_mined: number;
    spells_used: number;
}

export interface TreasureWarsStatistics extends HiveStatistic {
    kills: number;
    final_kills: number;
    deaths: number;
    treasure_destroyed: number;
    prestige: number;
}

export interface HideAndSeekStatistics extends HiveStatistic {
    hider_kills: number;
    seeker_kills: number;
    deaths: number;
}

export interface SurvivalGamesStatistics extends HiveStatistic {
    kills: number;
    crates: number;
    deathmatches: number;
    cows: number;
}

export interface DeathRunStatistics extends HiveStatistic {
    kills: number;
    deaths: number;
    checkpoints: number;
    activated: number;
}

export interface MurderMysteryStatistics extends HiveStatistic {
    uncapped_xp: number;
    murders: number;
    murderer_eliminations: number;
    deaths: number;
    coins: number;
}

async function getApiResponse(playerName: string, game: string): Promise<Response> {
    return await fetch(`${API_URL}/game/all/${game}/${playerName}`);
}

export async function getStats<T>(playerName: string, game: string): Promise<T | null> {
    const response = await getApiResponse(playerName, game);
    if (!response.ok) {
        return null;
    }
    const json = await response.json();
    return json as T;
}
