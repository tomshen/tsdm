import { readdir, statSync } from "fs";
import { resolve } from "path";

import * as chalk from "chalk";
import * as rimraf from "rimraf";

import { findDependencies, Typing } from "./dependency";
import { downloadDefinitelyTypedTypings } from "./download";
import { log, logDebug, logError } from "./logger";

export const TYPINGS_DIR = resolve(process.cwd(), "typings");

export interface IInstallOptions {
    direct?: boolean, // direct install by user
    update?: boolean
}

function isInstalled(typing: Typing) {
    let path: string;
    if (typing.packageName && typing.fileName) {
        path = resolve(TYPINGS_DIR, typing.packageName, typing.fileName);
    } else {
        path = resolve(TYPINGS_DIR, typing.packageName);
    }
    try {
        statSync(path);
        return true;
    } catch (error) {
        return false;
    }
}

export function install(typing: Typing, options: IInstallOptions = { direct: false, update: false }, callback?: any) {
    if (!options.update && isInstalled(typing)) {
        logDebug("install", `${typing.packageName}${typing.fileName ? "/" + typing.fileName : ""} was already installed.`);
        if (options.direct) {
            logDebug("install", "Run " + chalk.bold(`tsdm update ${typing.packageName}`) + " to reinstall.");
        }
        return;
    }
    const commandVerb = isInstalled(typing) && options.update ? "Updated" : "Installed";
    callback = callback || ((error: any, typing: Typing) => {
        if (error) {
            logError("install", error);
            return;
        }
        log("install", `${commandVerb} ${typing.packageName}/${typing.fileName}`);
    });
    downloadDefinitelyTypedTypings(typing, TYPINGS_DIR, (error, typing?, body?) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, typing);
        findDependencies(body, typing.packageName).forEach((typing) => {
            install(typing, { direct: false, update: false }, callback);
        });
    });
}

export function uninstall(name: string) {
    if (!isInstalled({ packageName: name })) {
        logError("uninstall", {
            message: `${name} is not installed.`
        });
        return;
    }
    rimraf(resolve(TYPINGS_DIR, name), (error: any) => {
        if (error) {
            logError("uninstall", error);
            return;
        }
        log("uninstall", name);
    });
}
