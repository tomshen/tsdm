import { readdir } from "fs";
import { resolve } from "path";

import * as rimraf from "rimraf";

const TYPINGS_DIR = "typings";

export function uninstall(name: string, callback: any) {
    readdir(TYPINGS_DIR, (error, files) => {
        if (error) {
            callback(error);
            return;
        }
        const index = files.indexOf(name);
        if (index === -1) {
            callback(null);
            return;
        }
        rimraf(resolve(TYPINGS_DIR, files[index]), callback);
    });
}
