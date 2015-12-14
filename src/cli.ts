import * as commander from "commander";

import { downloadDefinitelyTypedTypings } from "./index";

commander
    .version(require("../package").version)
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

commander.parse(process.argv);
