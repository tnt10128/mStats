import fs from 'node:fs';
import path from 'path';
import { client, __dirname } from './index.js';
import * as logging from './util/logging.js';

export default interface Listener {
    event: unknown;
    once: boolean;
    execute: (event: unknown) => Promise<unknown>;
}

export function registerListeners(): void {
    const listenerPath = path.join(__dirname, 'event');
    const listenerFiles = fs
        .readdirSync(listenerPath)
        .filter((file: string) => file.endsWith('.ts'));
    listenerFiles.forEach(async (file: string) => {
        const filePath = path.join(listenerPath, file);
        const listener = await import(filePath);
        if ('event' in listener && 'once' in listener && 'execute' in listener) {
            if (listener.once) {
                client.once(listener.event, listener.execute);
            } else {
                client.on(listener.event, listener.execute);
            }
        } else {
            logging.logError(`The listener at path ${filePath} is missing a required property.`);
        }
    });
}
