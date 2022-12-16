export async function get(url: string) {
    return await fetch(url);
}

export async function getJson(url: string) {
    const response = await get(url);
    return await response.json();
}