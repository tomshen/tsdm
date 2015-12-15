import { blue, gray, red, white } from "chalk";

function formatCommand(command: string) {
    return blue.bold.underline(command);
}

export function log(command: string, message: string) {
    console.log(`${formatCommand(command)} ${white(message)}`);
}

export function logDebug(command: string, message: string) {
    console.log(`${formatCommand(command)} ${gray(message)}`);
}

export function logError(command: string, error: { message: string }) {
    console.error(`${formatCommand(command)} ${red(error.message)}`);
}
