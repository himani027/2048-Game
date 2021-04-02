import { Game } from "./game";
import { listenKey } from "./keys";


async function main() {
  console.log("Use Arrow Keys to play game");
  console.log("\nPress any alphabet to start game");

  // check key input at starting
  const key = await listenKey();
  if (!key) {
    console.log("Incorrect Input");
    process.exit();
  }

  // object of game class
  const game = new Game();

  // Checking game over and win condition
  while (true) {
    if (game.IsOver()) {
      break;
    }

    if (game.IsWin()) {
      break;
    }

    game.AddElement(); // add new element to matrix
    game.Display();    // display updated matrix
    await game.TakeInput();  // wait for next direction key input
  }


  // Storing maximum valued tile
  const { maximum } = game.CountScore();

  /* 
  For demo purpose we have considered 128 valued tile for winning condition.
  If user slide elements and make tile of 128 user will win and game ends,
  making tile of 2048 is bit tricky.
  */

  if (maximum == 128) {
    console.log("\n***** You Win *****");
    console.log("\nPlay Again...");
  }
  else {
    console.log("\nHighest Tile Value : ", maximum);
    console.log("\nGame Over! Try Again");
  }

  process.exit();
}

main();
