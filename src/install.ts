import { readdir } from "fs";
import { resolve } from "path";

import * as rimraf from "rimraf";

import { downloadDefinitelyTypedTypings } from "./download";
import { findDependencies, Typing } from "./dependency";

export const TYPINGS_DIR = "typings";

export function install(typing: Typing, callback?: any) {
    callback = callback || ((err: any, typing: Typing) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Installed: ${typing.packageName}/${typing.fileName}`);
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

export function uninstall(name: string, callback: any) {
    rimraf(resolve(TYPINGS_DIR, name), callback);
}
