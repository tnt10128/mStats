export async function get(url: string) {
    const response = await fetch(url);
    return await response;
}

export async function getJson(url: string) {
    const response = await get(url);
    return await response.json();
}