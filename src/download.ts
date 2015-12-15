import { readFileSync, writeFile } from "fs";
import { IncomingMessage } from "http";
import { homedir } from "os";
import { dirname, resolve } from "path";

import * as mkdirp from "mkdirp";
import * as request from "request";

import { Typing } from "./dependency";
import { log, logError } from "./logger";

function makeRequest(url: string, callback: (error: any, body?: any)=>void) {
    function handleRequestErrors(callback: (error: any, body?: any)=>void) {
        return (error: any, response: IncomingMessage, body: any) => {
            if (error) {
                callback(error);
            } else if (response.statusCode === 403) {
                callback({
                    message: "Rate limited by Github. Generate a token at https://github.com/settings/tokens and save" +
                        " it to ~/.tsdmrc in the form { \"token\": \"TOKEN\" }."
                });
            } else if (response.statusCode !== 200) {
                callback({
                    message: `HTTP ${response.statusCode} (${response.statusMessage}): ${url}`
                });
            } else {
                callback(null, body);
            }
        };
    }

    const headers: any = {
        "User-Agent": "tsdm"
    };

    try {
        const tsdmrc = JSON.parse(readFileSync(resolve(homedir(), ".tsdmrc")).toString());
        headers.Authorization = `token ${tsdmrc.token}`;
    } catch (error) {
        logError("download", error);
    }

    request({
        url: url,
        headers: headers
    }, handleRequestErrors(callback));
}

function downloadFile(url: string, path: string, callback: (error: any, body?: any)=>void) {
    mkdirp(dirname(path), (error: any) => {
        if (error) {
            callback(error);
            return;
        }
        makeRequest(url, (error, body) => {
            if (error) {
                callback(error);
                return;
            }
            writeFile(path, body, (error) => callback(error, body));
        });
    });
}

function getDefinitelyTypedTypings(typing: Typing, callback: (err: any, typings?: Typing[])=>void) {
    const typingPath = typing.fileName ? `${typing.packageName}/${typing.fileName}` : typing.packageName;
    const url = `https://api.github.com/repos/DefinitelyTyped/DefinitelyTyped/contents/${typingPath}`;

    makeRequest(url, (err: any, body: string) => {
        if (err) {
            callback(err);
            return;
        }
        let typings: any[];
        try {
            const parsedBody = JSON.parse(body);
            typings = Array.isArray(parsedBody) ? parsedBody : [ parsedBody ];
        } catch(error) {
            callback({
                message: `Unable to parse as JSON: ${body}`
            });
            return;
        }
        typings = typings
            .filter((content: any) => /\.d\.ts$/.test(content.name))
            .map((content: any) => {
                return {
                    packageName: typing.packageName,
                    fileName: content.name,
                    url: content.download_url
                };
            });
        callback(err, typings);
    });
}

export function downloadDefinitelyTypedTypings(typing: Typing, typingsDir: string,
        callback: (error: any, typing?: Typing, body?: any)=>void) {
    getDefinitelyTypedTypings(typing, (error, typings?) => {
        if (error) {
            callback(error);
            return;
        }
        typings.forEach((typing) => {
            downloadFile(typing.url, `${typingsDir}/${typing.packageName}/${typing.fileName}`,
                (error, body) => callback(error, typing, body));
        });
    });
}
