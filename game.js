const crypto = require('crypto');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const { table } = require('table');
const input = process.argv;

input.shift();
input.shift();

// Start check
if (input.length < 3 || input.length % 2 === 0) {
    console.log('There must be 3 or more odd non-repeating lines. "node game.js 1)rock 2)paper 3)scissors..."');
    return false;
} else if (hasDuplicates(input)) {
    console.log('There should be no duplicate elements!');
    return false;
}

function hasDuplicates(array) {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

// Play
class Play {
    static letsPlay() {
        const key = Computer.getKey();
        console.log('Available moves:');
        for (var i = 0; i < input.length; i++) {
            console.log(`${i + 1} - ${input[i]}`);
        }
        console.log('0 - exit');
        console.log('? - help');
        const askUserMove = () => rl.question(
            'Enter your move: ', (move) => {
                if (move == 0) {
                    rl.close();
                    return;
                } else if (move === '?') {
                    Table.getTable(input);
                    askUserMove();
                    return;
                } else if (move >= input.length + 1) {
                    console.log('Enter the correct value!');
                    askUserMove();
                    return;
                } else {
                    console.log(`Your move: ${input[move - 1]}`);
                    const compMove = Computer.getComputerMove();
                    console.log(`Computer move: ${input[compMove]}`);
                    switch (Rules.getWinner(move - 1, compMove, input)) {
                        case 0:
                            console.log("It's a draw");
                            Computer.getFinalHex(key, compMove);
                            break;
                        case 1:
                            console.log('You Win!');
                            Computer.getFinalHex(key, compMove);
                            break;
                        case -1:
                            console.log('You Lose.');
                            Computer.getFinalHex(key, compMove);
                            break;
                    }
                    rl.close();
                    return;
                }
            });
        askUserMove();
    }
}

// Computer
class Computer {
    static getKey() {
        const key = crypto.randomBytes(32).toString('hex');
        console.log(key);
        return key;
    }

    static getComputerMove() {
        const computer = Math.floor(Math.random() * (input.length));
        return computer;
    }

    static getFinalHex(key, move) {
        const hash = crypto.createHash("SHA3-256");
        const finalHex = hash.update(key, move).digest("hex");
        console.log(finalHex);
    }
}

// Rules
class Rules {
    static getWinner(userMoveIndex, computerMoveIndex, moves) {
        const n = moves.length;
        const half = Math.floor(n / 2);

        if (userMoveIndex === computerMoveIndex) {
            return 0;
        } else if (
            userMoveIndex - computerMoveIndex < 0 && Math.abs(userMoveIndex - computerMoveIndex) <= half ||
            userMoveIndex - computerMoveIndex > 0 && userMoveIndex - computerMoveIndex > half
        ) {
            return -1;
        } else {
            return 1;
        }
    }
}

// Table generator
class Table {
    static getTable(input) {
        let arr = [];
        for (let i = 0; i <= input.length && i <= 5; i++) {
            arr[i] = [];
            for (let j = 0; j <= input.length && j <= 5; j++) {
                if (i === 0 && j === 0) {
                    arr[i].push('PC Moves');
                } else if (i === j) {
                    arr[i].push('Draw');
                } else if (i === 0) {
                    arr[i].push(input[j - 1]);
                } else if (j === 0) {
                    arr[i].push(input[i - 1]);
                } else if (Rules.getWinner(i, j, input) === 1) {
                    arr[i].push('Win');
                } else {
                    arr[i].push('Lose');
                }
            }
        }
        return console.log(table(arr));
    }
}

Play.letsPlay();
