import { parseContent } from "./parsers/parser";
import fs from "fs";
import request from "request";

function writeResultToFile(content) {
    let parsedContent = parseContent(content);

    fs.writeFile("result_form_condition.json", JSON.stringify(parsedContent),
        (err) => {
            if (err) {
                throw err;
            }
        });
}

function init() {
    const args = process.argv.slice(2);
    const filePath = args[ 0 ];
    const isUrl = (args[ 1 ] === "true");

    if (isUrl) {
        request({ url: filePath, "rejectUnauthorized": false }, ("response", (err, response, body) => {
            writeResultToFile(body);
            if (err) {
                throw err;
            }
        }));
    } else {
        fs.readFile(filePath, "UTF-8", (err, content) => {
            writeResultToFile(content);
            if (err) {
                throw err;
            }
        });

    }
}


init();
