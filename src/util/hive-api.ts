const API_URL = 'https://api.playhive.com/v0';

export interface SkyWarsStatistics {
    UUID: string;
    xp: number;
    played: number;
    victories: number;
    first_played: number;
    kills: number;
    mystery_chests_destroyed: number;
    ores_mined: number;
    spells_used: number;
}

export interface TreasureWarsStatistics {
    UUID: string;
    xp: number;
    played: number;
    victories: number;
    first_played: number;
    kills: number;
    final_kills: number;
    deaths: number;
    treasure_destroyed: number;
    prestige: number;
}

export interface HideAndSeekStatistics {
    UUID: string;
    xp: number;
    played: number;
    victories: number;
    first_played: number;
    hider_kills: number;
    seeker_kills: number;
    deaths: number;
}

export interface SurvivalGamesStatistics {
    UUID: string;
    xp: number;
    played: number;
    victories: number;
    first_played: number;
    kills: number;
    crates: number;
    deathmatches: number;
    cows: number;
}

export interface DeathRunStatistics {
    UUID: string;
    xp: number;
    played: number;
    victories: number;
    first_played: number;
    kills: number;
    deaths: number;
    checkpoints: number;
    activated: number;
}

export interface MurderMysteryStatistics {
    UUID: string;
    xp: number;
    uncapped_xp: number;
    played: number;
    victories: number;
    first_played: number;
    murders: number;
    murderer_eliminations: number;
    deaths: number;
    coins: number;
}

async function getApiResponse(playerName: string, game: string): Promise<Response> {
    return await fetch(`${API_URL}/game/all/${game}/${playerName}`);
}

export async function getStats<T>(
    playerName: string,
    game: string
): Promise<T | null> {
    const response = await getApiResponse(playerName, game);
    if (!response.ok) {
        return null;
    }
    const json = await response.json();
    return json as T;
}
