import { readdir } from "fs";
import { resolve } from "path";

import * as rimraf from "rimraf";

import { findDependencies, Typing } from "./dependency";
import { downloadDefinitelyTypedTypings } from "./download";
import { log, logError } from "./logger";

export const TYPINGS_DIR = resolve(process.cwd(), "typings");

export function install(typing: Typing, callback?: any) {
    callback = callback || ((error: any, typing: Typing) => {
        if (error) {
            logError("install", error);
            return;
        }
        log("install", `${typing.packageName}/${typing.fileName}`);
    });
    downloadDefinitelyTypedTypings(typing, TYPINGS_DIR, (error, typing?, body?) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, typing);
        findDependencies(body, typing.packageName).forEach((typing) => {
            install(typing, callback);
        });
    });
}

export function uninstall(name: string) {
    rimraf(resolve(TYPINGS_DIR, name), (error: any) => {
        if (error) {
            logError("uninstall", error);
            return;
        }
        log("uninstall", name);
    });
}
