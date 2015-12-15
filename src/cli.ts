import * as commander from "commander";

import { install, parseTyping, uninstall, Typing, TYPINGS_DIR } from "./index";

commander
    .version(require("../package").version);

commander
    .command("install <name> [otherNames...]")
    .description(`install typings to ${TYPINGS_DIR}`)
    .action((name: string, otherNames: string[]) => {
        [name, ...otherNames]
            .map(parseTyping)
            .forEach((typing) => install(typing)); // Don't pass in index, array
    });

commander
    .command("uninstall <name> [otherNames...]")
    .alias("remove")
    .description(`uninstall typings from ${TYPINGS_DIR}`)
    .action((name: string, otherNames: string[]) => {
        [name, ...otherNames].forEach((name) => {
            uninstall(name, (err: any) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.log(`Uninstalled: ${name}`);
            });
        });
    });

commander.parse(process.argv);
