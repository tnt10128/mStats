export async function getUuidByUserName(name:string) {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`);
    if (!response.ok) {
        throw new Error(`Failed to get UUID for ${name}`);
    }
    const json = await response.json();
    return json.id;
}