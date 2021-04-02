"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const keys_1 = require("./keys");
const Table = require("cli-table3");
const chalk_1 = require("chalk");
// size of grid 
const row = 4;
const col = 4;
// Exporting Game class for reusing it main fn to create object
class Game {
    // call when first object of Game class is created
    constructor() {
        this.grid = [];
        this.over = false;
        this.win = false;
        this.newRow = 0;
        this.newCol = 0;
        this.init();
    }
    init() {
        for (let i = 0; i < row; i++) {
            this.grid.push(Array(col).fill(0));
        }
    }
    // Display Grid in Terminal
    Display() {
        console.clear();
        // object of table using cli-table3 to print grid in terminal
        const table = new Table({
            style: { "padding-left": 2, "padding-right": 2 },
        });
        let printGrid = JSON.parse(JSON.stringify(this.grid) // convert into string
        );
        printGrid = this.printPreset(printGrid);
        const newVal = printGrid[this.newRow][this.newCol];
        // formatting a bit of text in terminal using bold & color
        printGrid[this.newRow][this.newCol] = chalk_1.bold.red(newVal);
        // combining rows columns & printing
        table.push(...printGrid);
        console.log(table.toString());
    }
    // Generate 2 and 4 randomly  
    AddElement() {
        let val = randomInt(100);
        if (val < 80) {
            val = 2;
        }
        else {
            val = 4;
        }
        let empty = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (this.grid[i][j] === 0) {
                    empty++;
                }
            }
        }
        // adding new elements in empty tile
        let elementCount = randomInt(empty) + 1;
        let index = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (this.grid[i][j] === 0) {
                    index++;
                    if (index === elementCount) {
                        this.newRow = i;
                        this.newCol = j;
                        this.grid[i][j] = val;
                        return;
                    }
                }
            }
        }
    }
    // Taking direction input from user & perform particular fn 
    async TakeInput() {
        const key = await keys_1.getDirection();
        switch (key) {
            case keys_1.direction.left:
                this.moveLeft();
                break;
            case keys_1.direction.right:
                this.moveRight();
                break;
            case keys_1.direction.up:
                this.moveUp();
                break;
            case keys_1.direction.down:
                this.moveDown();
                break;
        }
    }
    CountScore() {
        const result = {
            maximum: 0,
        };
        // getting maximum valued tile from grid
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                result.maximum = max(result.maximum, this.grid[i][j]);
            }
        }
        return result;
    }
    // checking win condition (tile value is 128)
    IsWin() {
        let win = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (this.grid[i][j] === 128) {
                    this.over = true;
                    // exiting game if 128 tile found
                    this.IsOver();
                    break;
                }
            }
        }
        return win === 128;
    }
    // checking if all tiles are filled in grid
    IsOver() {
        let empty = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (this.grid[i][j] === 0) {
                    empty++;
                }
            }
        }
        return empty === 0 || this.over;
    }
    // transforming the grid as per input of directions
    moveUp() {
        this.reverseRows();
        this.moveDown();
        this.reverseRows();
    }
    moveDown() {
        this.transpose();
        this.moveLeft();
        this.transpose();
        this.transpose();
        this.transpose();
    }
    // all elements of row to left side wall
    moveLeft() {
        for (let i = 0; i < row; i++) {
            this.grid[i] = this.moveRow(this.grid[i]);
        }
    }
    moveRight() {
        this.reverse();
        this.moveLeft();
        this.reverse();
    }
    // grid after 1 direction input 
    printPreset(r) {
        const result = [];
        for (let i = 0; i < row; i++) {
            result.push(Array(col).fill(0));
        }
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                result[i][j] = r[i][j] || " ";
            }
        }
        return result;
    }
    // iterate through each row & apped reversed rows to grid
    reverse() {
        for (let i = 0; i < row; i++) {
            this.grid[i] = this.grid[i].reverse();
        }
    }
    // iterate through each column & append reversed columns to grid
    reverseRows() {
        const result = [];
        for (let i = 0; i < row; i++) {
            result.push(Array(col).fill(0));
        }
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                result[row - i - 1][j] = this.grid[i][j];
            }
        }
        this.grid = result;
    }
    // [[1, 2], [4, 5]] ==> [[1,4], [2, 5]]
    transpose() {
        const result = [];
        for (let i = 0; i < row; i++) {
            result.push(Array(col).fill(0));
        }
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                result[i][j] = this.grid[col - j - 1][i];
            }
        }
        this.grid = result;
    }
    moveRow(r) {
        let result = [];
        for (let i = 0; i < col; i++) {
            if (r[i] !== 0) {
                result.push(r[i]);
            }
        }
        if (result.length < col) {
            result = this.rowFillInit(result);
        }
        return this.mergeElements(result);
    }
    // enter value in empty tile
    rowFillInit(arr) {
        const result = arr;
        const remaining = col - result.length;
        for (let i = 0; i < remaining; i++) {
            result.push(0);
        }
        return result;
    }
    mergeElements(arr) {
        let result = [];
        result[0] = arr[0];
        let index = 0;
        // merge similar tiles &
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === result[index]) {
                result[index] += arr[i];
            }
            else {
                index++;
                result[index] = arr[i];
            }
        }
        if (result.length < col) {
            result = this.rowFillInit(result);
        }
        return result;
    }
}
exports.Game = Game;
// generate random number function used to add new elements
function randomInt(max, min = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// max function for checking tiles value
function max(a, b) {
    return a > b ? a : b;
}
