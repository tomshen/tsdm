const dependencyDifferentPackagePattern = /^\/\/\/\s*<reference\s+path="\.\.\/(.*)\/(.*)\.d\.ts"\s*\/>$/;
const dependencySamePackagePattern = /^\/\/\/\s*<reference\s+path="(?:\.\/)?(.*)\.d\.ts"\s*\/>$/;
const typingPattern = /(.*)\/(.*)(?:\.d\.ts)?/;

export interface Typing {
    packageName: string;
    fileName?: string;
    url?: string;
    path?: string; // local
}

function isTyping(typing: any): typing is Typing {
    return typeof(typing) === "object" && "packageName" in typing;
}

function addDtsExtension(name: string) {
    return /\.d\.ts$/.test(name) ? name : name + ".d.ts";
}

export function parseTyping(typing: string|Typing): Typing {
    if (isTyping(typing)) {
        return typing;
    } else {
        const matches = typingPattern.exec(typing);
        if (matches === null) {
            return {
                packageName: typing
            };
        }
        return {
            packageName: matches[1],
            fileName: addDtsExtension(matches[2])
        };
    }
}

function parseDependency(line: string, packageName: string): Typing {
    let matches = dependencyDifferentPackagePattern.exec(line.trim());
    if (matches === null) {
        matches = dependencySamePackagePattern.exec(line.trim());
        if (matches === null) {
            return null;
        }
        return {
            packageName: packageName,
            fileName: addDtsExtension(matches[1])
        };
    }
    return {
        packageName: matches[1],
        fileName: addDtsExtension(matches[2])
    };
}

export function findDependencies(content: string, packageName: string): Typing[] {
    return content
        .split("\n")
        .map((line) => parseDependency(line, packageName))
        .filter((match: Typing) => match !== null);
}
