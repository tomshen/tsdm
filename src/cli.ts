import * as commander from "commander";

import { downloadDefinitelyTypedTypings, uninstall } from "./index";

commander
    .version(require("../package").version);

commander
    .command("install <name>")
    .action((name: string) => {
        downloadDefinitelyTypedTypings(name, (err) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(`Downloaded typings for ${name}`);
        });
    });

commander
    .command("uninstall <name>")
    .action((name: string) => {
        uninstall(name, (err: any) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(`Uninstalled typings for ${name}`);
        });
    });

commander.parse(process.argv);
