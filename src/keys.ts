import { createInterface, emitKeypressEvents } from "readline";

// interface for reading data
const read = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// reads keypress events according to input
emitKeypressEvents(process.stdin)  // readable stream


// asynchronous function to check input at starting of game
export async function listenKey() {

  // returns promise-resolved if given correct input
  return new Promise<string>((resolve) => {
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

// assigning numeric enums for directions
export enum direction {
  up = 1,
  down,
  left,
  right,
}

// function to get input as directions using arrow keys
export async function getDirection(): Promise<direction> {
  const keyboardMoveType: { [key: string]: direction } = {
    up: direction.up,
    down: direction.down,
    left: direction.left,
    right: direction.right,
  };

  // pause exceution & wait for further input 
  const key = await listenKey();

  return keyboardMoveType[key]
}
