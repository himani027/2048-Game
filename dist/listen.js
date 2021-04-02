"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoveKey = exports.moveKey = exports.listenCliKey = void 0;
const readline_1 = require("readline");
// import { moveKey } from "./game";
const term = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout,
});
readline_1.emitKeypressEvents(process.stdin);
async function listenCliKey() {
    process.stdin.setRawMode(true);
    term.resume();
    return new Promise((resolve) => {
        process.stdin.once("keypress", (_, key) => {
            process.stdin.removeListener("keypress", () => { });
            if (key && key.ctrl && key.name === 'c') {
                term.close();
                process.exit();
            }
            resolve(key.name);
        });
    });
}
exports.listenCliKey = listenCliKey;
var moveKey;
(function (moveKey) {
    moveKey[moveKey["up"] = 1] = "up";
    moveKey[moveKey["down"] = 2] = "down";
    moveKey[moveKey["left"] = 3] = "left";
    moveKey[moveKey["right"] = 4] = "right";
    moveKey[moveKey["noDir"] = 5] = "noDir";
})(moveKey = exports.moveKey || (exports.moveKey = {}));
async function getMoveKey() {
    const keyboardMoveType = {
        left: moveKey.left,
        right: moveKey.right,
        up: moveKey.up,
        down: moveKey.down,
    };
    const key = await listenCliKey();
    if (!key) {
        return moveKey.noDir;
    }
    return keyboardMoveType[key] || moveKey.noDir;
}
exports.getMoveKey = getMoveKey;
