"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirection = exports.direction = exports.listenKey = void 0;
const readline_1 = require("readline");
// interface for reading data
const read = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// reads keypress events according to input
readline_1.emitKeypressEvents(process.stdin); // readable stream
// asynchronous function to check input at starting of game
async function listenKey() {
    // returns promise-resolved if given correct input
    return new Promise((resolve) => {
        process.stdin.on("keypress", (_, key) => {
            // remove listener when ctrl+c is pressed
            process.stdin.removeListener("keypress", () => { });
            if (key && key.ctrl && key.name === 'c') {
                read.close(); // stop taking input
                process.exit(); // exit game
            }
            resolve(key.name);
        });
    });
}
exports.listenKey = listenKey;
// assigning numeric enums for directions
var direction;
(function (direction) {
    direction[direction["up"] = 1] = "up";
    direction[direction["down"] = 2] = "down";
    direction[direction["left"] = 3] = "left";
    direction[direction["right"] = 4] = "right";
})(direction = exports.direction || (exports.direction = {}));
// function to get input as directions using arrow keys
async function getDirection() {
    const keyboardMoveType = {
        up: direction.up,
        down: direction.down,
        left: direction.left,
        right: direction.right,
    };
    // pause exceution & wait for further input 
    const key = await listenKey();
    return keyboardMoveType[key];
}
exports.getDirection = getDirection;
