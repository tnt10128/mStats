import { custom, title } from 'format-logs';

export function logTitle(message: string): void {
    console.info(title(message));
}

export function logSuccess(message: string): void {
    console.info(`✅ ${custom(' SUCCESS: ', 'bgGreen')} ${custom(message, 'green')}`);
}

export function logInfo(message: string): void {
    console.info(`ℹ️ ${custom(' INFO: ', 'bgCyan')} ${custom(message, 'cyan')}`);
}

export function logWarn(message: string): void {
    console.warn(`⚠️ ${custom(' WARNING: ', 'bgYellow')} ${custom(message, 'yellow')}`);
}

export function logError(message: string): void {
    console.error(`🔴 ${custom(' ERROR: ', 'bgRed')} ${custom(message, 'red')}`);
}
