import fs from "node:fs";
import path from "node:path";

export function getVersion(){

    const file = path.join(import.meta.dirname, '../package.json');

    const rawJson = fs.readFileSync(file).toString('utf-8');

    const json = JSON.parse(rawJson);

    return `${json.name} v${json.version}`;
}


export function getHelp(){

    const file = path.join(import.meta.dirname, '../help.txt');

    const rawFile = fs.readFileSync(file).toString('utf-8');

    return rawFile;
}

