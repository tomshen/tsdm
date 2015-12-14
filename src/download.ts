import { writeFile } from "fs";
import { IncomingMessage } from "http";
import { dirname } from "path";

import * as mkdirp from "mkdirp";
import * as request from "request";

function makeRequest(url: string, callback: (error: any, body?: any)=>void) {
    function handleRequestErrors(callback: (error: any, body?: any)=>void) {
        return (error: any, response: IncomingMessage, body: any) => {
            if (error) {
                callback(error);
            } else if (response.statusCode != 200) {
                callback({
                    message: `HTTP ${response.statusCode}: ${response.statusMessage}`
                });
            } else {
                callback(null, body);
            }
        };
    }

    request({
        url: url,
        headers: {
            "User-Agent": "tsdm"
        }
    }, handleRequestErrors(callback));
}

function downloadFile(url: string, path: string, callback: (err: any)=>void) {
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
            writeFile(path, body, callback);
        });
    });
}

function getDefinitelyTypedTypings(name: string, callback: (err: any, files?: string[])=>void) {
    const url = `https://api.github.com/repos/DefinitelyTyped/DefinitelyTyped/contents/${name}`;
    makeRequest(url, (err: any, body: string) => {
        if (err) {
            callback(err);
            return;
        }
        callback(err, JSON.parse(body));
    });
}

export function downloadDefinitelyTypedTypings(name: string, typingsDir: string, callback: (err: any)=>void) {
    getDefinitelyTypedTypings(name, (err, files) => {
        if (err) {
            callback(err);
            return;
        }
        files
            .filter((content: any) => /\.d\.ts$/.test(content.name))
            .forEach((content: any) => {
                const fileName = content.name;
                const downloadUrl = content.download_url;
                downloadFile(downloadUrl, `${typingsDir}/${name}/${fileName}`, callback);
            });
    });
}
