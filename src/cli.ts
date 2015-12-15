import * as commander from "commander";

import { parseTyping, Typing } from "./dependency";
import { install, uninstall, TYPINGS_DIR } from "./install";

commander
    .version(require("../package").version);

commander
    .command("install <name> [otherNames...]")
    .description(`install typings to ${TYPINGS_DIR}`)
    .action((name: string, otherNames: string[]) => {
        [name, ...otherNames]
            .map(parseTyping)
            .forEach((typing) => install(typing, {
                direct: true,
                update: false
            })); // Don't pass in index, array
    });

commander
    .command("update <name> [otherNames...]")
    .description(`update typings in ${TYPINGS_DIR}`)
    .action((name: string, otherNames: string[]) => {
        [name, ...otherNames]
            .map(parseTyping)
            .forEach((typing) => install(typing, {
                direct: true,
                update: true
            })); // Don't pass in index, array
    });

commander
    .command("uninstall <name> [otherNames...]")
    .alias("remove")
    .description(`uninstall typings from ${TYPINGS_DIR}`)
    .action((name: string, otherNames: string[]) => {
        [name, ...otherNames].forEach(uninstall);
    });

commander.parse(process.argv);
