# sudoku
A sudoku solver
This is a brute force, human like, sudoku solver in JS.
It starts by marking the possible numbers for every cell.
In every iteration it looks for numbers with a single possible location in their row, coloum, or block.
Then it looks for cells that have a single possibe number.
At the end it prints the possible numbers for every cell left.
This will solve many easy sudoko's but not hard ones.
The next step is to work down guesses on the cells with less possibilities until a solution is found or a contrediction happens.
If a contrediction happens, rollback to the forked state and take the next guess.
Start from sudoku.html
