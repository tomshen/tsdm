import * as commander from "commander";

import { install, parseTyping, uninstall, Typing, TYPINGS_DIR } from "./index";

commander
    .version(require("../package").version);

commander
    .command("install <name>")
    .description(`install typings to ${TYPINGS_DIR}`)
    .action((name: string) => {
        const typing = parseTyping(name);
        install(typing);
    });

commander
    .command("uninstall <name>")
    .alias("remove")
    .description(`uninstall typings from ${TYPINGS_DIR}`)
    .action((name: string) => {
        uninstall(name, (err: any) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(`Uninstalled: ${name}`);
        });
    });

commander.parse(process.argv);
