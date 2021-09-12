// A sudoku solver
// Roni Zaharia, 8 September 2021

// The sudoko size - standrad 9 
const N=9;

// The block size
const B=3;

// X is null empty cell
const X = ".";

// The initial SuDoKu board. X's are empty cells.
const initialState2 = [
  [ X, X, 9,  X, X, X,  X, X, 8 ],
  [ X, 3, X,  2, X, X,  7, X, X ],
  [ X, X, X,  X, 3, 5,  X, 9, X ],
  
  [ 9, X, X,  X, X, 8,  1, X, X ],
  [ 7, 6, 1,  X, X, X,  8, 4, 2 ],
  [ X, X, 8,  1, X, X,  X, X, 9 ],
  
  [ X, 8, X,  5, 7, X,  X, X, X ],
  [ X, X, 4,  X, X, 6,  X, 8, X ],
  [ 3, X, X,  X, X, X,  4, X, X ]
];

const initialState1 = [
  [ 7, X, X,  X, X, X,  X, X, 4 ],
  [ X, 8, 4,  X, 1, X,  X, X, X ],
  [ X, X, 2,  X, X, 9,  X, 7, 1 ],
  
  [ 1, 6, X,  9, X, X,  7, X, X ],
  [ X, X, X,  X, 2, X,  X, X, X ],
  [ X, X, 9,  X, X, 8,  X, 5, 3 ],
  
  [ 3, 4, X,  6, X, X,  9, X, X ],
  [ X, X, X,  X, 9, X,  1, 6, X ],
  [ 9, X, X,  X, X, X,  X, X, 7 ]
];

const initialState = [
  [ 3, 2, X,  X, X, 5,  8, X, X ],
  [ X, 7, X,  X, X, X,  X, X, X ],
  [ X, X, 9,  4, X, X,  3, X, 5 ],
  
  [ X, X, X,  X, 7, 1,  X, 9, X ],
  [ X, X, X,  2, X, 4,  X, X, X ],
  [ X, 4, X,  6, 5, X,  X, X, X ],
  
  [ 7, X, 3,  X, X, 6,  1, X, X ],
  [ X, X, X,  X, X, X,  X, 2, X ],
  [ X, X, 4,  1, X, X,  X, 8, 9 ]
];

// All numbers
const allOptions = [1,2,3,4,5,6,7,8,9];

// A board class
class Board {
  constructor () {
    // The board current state is initialized from initial state
    this.state = initialState1.slice();
    this.options = new Array(N);
    // The board solutions space is represented as NxN array.
    // Each cell holds a stack with possible values for that cell.
    for (let i=0; i<N; i++) {
      this.options[i] = new Array(N);
      for (let j=0; j<N; j++) {
        this.options[i][j] = allOptions.slice();
      }
    }
  }

  // Remove cell options by taking out all the numbers that
  // are already placed on the same row
  removeCellOptionsByRow(i, j) {
    for (let x=0;x<j;x++) {
      if (this.state[i][x] != X) {
        let o = this.options[i][j].indexOf(this.state[i][x]);
        if (o > -1) 
          this.options[i][j].splice(o,1);
      }
    }
    for (let x=j+1;x<N;x++) {
      if (this.state[i][x] != X) {
        let o = this.options[i][j].indexOf(this.state[i][x]);
        if (o > -1) 
          this.options[i][j].splice(o,1);
      }
    }
  }

  // Remove cell options by taking out all the numbers that
  // are already placed on the same column
  removeCellOptionsByColumn(i, j) {
    for (let y=0;y<i;y++) {
      if (this.state[y][j] != X) {
        let o = this.options[i][j].indexOf(this.state[y][j]);
        if (o > -1) 
          this.options[i][j].splice(o,1);
      }
    }
    for (let y=i+1;y<N;y++) {
      if (this.state[y][j] != X) {
        let o = this.options[i][j].indexOf(this.state[y][j]);
        if (o > -1) 
          this.options[i][j].splice(o,1);
      }
    }
  }
  // Remove options by block
  removeCellOptionsByBlock(i, j) {
    // Find the block
    let ib = Math.floor(i/B);
    let jb = Math.floor(j/B);
    for (let x=ib*B; x<ib*B+B; x++) {
      for (let y=jb*B; y<jb*B+B; y++) {
        if (x != i && y != j) { // skip the cell itself
          if (this.state[x][y] != X) {
            let o = this.options[i][j].indexOf(this.state[x][y]);
            if (o > -1) 
              this.options[i][j].splice(o,1);
          }
        }
      }
    }
  }
  // remove solution options based on the current state
  removeOptions() {
    for (let i=0; i<N; i++) {
      for (let j=0; j<N; j++) {
        if (this.state[i][j] == X) {
          this.removeCellOptionsByRow(i, j);
          this.removeCellOptionsByColumn(i, j);
          this.removeCellOptionsByBlock(i, j);
        }
      }
    }
  }
  // Calculate the new state
  calcNewState() {
    let n=0;
    for (let i=0; i<N; i++) {
      for (let j=0; j<N; j++) {
        // If there's only one option, put it
        if (this.state[i][j] == X && this.options[i][j].length == 1) 
        {
          this.state[i][j] = this.options[i][j][0];
          document.write("CNS: (" + (i+1) + "," + (j+1) + ") : " + this.state[i][j] + "<br/>")
          n++;
        }
      }
    }
    return n;
  }

  // Mark number and update options
  // mark the number n in cell {i,j} and remove all the affected onptions
  // in row i, column j and the block of i,j
  markAndRemove(n, i, j)
  {
    // Mark it
    this.state[i][j] = n;
    document.write("LUP: (" + (i+1) + "," + (j+1) + ") : " + this.state[i][j] + "<br/>")
    // Remove n from row i
    for (let x=0;x<i; x++) {
      if (this.state[x][j] == X) { // skip if solved
        let o = this.options[x][j].indexOf(n);
        if (o > -1)   
          this.options[x][j].splice(o,1);
      }
    }
    for (let x=i+1;x<N; x++) {
      if (this.state[x][j] == X) { // skip if solved
        let o = this.options[x][j].indexOf(n);
        if (o > -1) 
          this.options[x][j].splice(o,1);
      }
    }
    // Remove n from column j
    for (let y=0;y<j; y++) {
      if (this.state[i][y] == X) { // skip if solved
        let o = this.options[i][y].indexOf(n);
        if (o > -1) 
          this.options[i][y].splice(o,1);
      }
    }
    for (let y=j+1;y<N; y++) {
      if (this.state[i][y] == X) { // skip if solved
        let o = this.options[i][y].indexOf(n);
        if (o > -1) 
          this.options[i][y].splice(o,1);
      }
    }
    // Remove n from block containing i,j
    // Find the block
    let ib = Math.floor(i/B);
    let jb = Math.floor(j/B);
    for (let x=ib*B; x<ib*B+B; x++) {
      for (let y=jb*B; y<jb*B+B; y++) {
        if (x != i && y != j) { // skip the cell itself
          if (this.state[x][y] == X) { // skip if solved
            let o = this.options[i][j].indexOf(this.state[x][y]);
            if (o > -1) {
              this.options[i][j].splice(o,1);
            }
          }
        }
      }
    }
  }
  // Lookup for numbers that can be only in one place in row column or block
  lookupAndMarkFound() {
    let m=0;
    for (let n=1; n<=N; n++) {
      for (let i=0;i<N; i++) {
        let fr = this.findInRow(n,i);
        if (fr.length == 1) {
          this.markAndRemove(n,fr[0].i, fr[0].j);
          m++;
        }
        let fc = this.findInColumn(n,i);
        if (fc.length == 1) {
          this.markAndRemove(n,fc[0].i, fc[0].j);
          m++;
        }
        let fb = this.findInBlock(n,i);
        if (fb.length == 1) {
          this.markAndRemove(n,fb[0].i, fb[0].j);
          m++;
        }
      }
    }
    return m;
  }
  // Find number in row
  // return array with possible locations of n in i
  findInRow(n, i) {
    let m=new Array();
    for (let j=0;j<N; j++) {
      if (this.state[i][j] == X && this.options[i][j].indexOf(n) > -1) {
        m.push({i,j});
      }
    }
    return m;
  }
  // Find number in column
  // return array with possible locations of n in j
  findInColumn(n, j) {
    let m=new Array();
    for (let i=0;i<N; i++) {
      if (this.state[i][j] == X && this.options[i][j].indexOf(n) > -1) {
        m.push({i,j});
      }
    }
    return m;
  }
  // Find number in block
  // return array with possible locations of n in b
  findInBlock(n, b) {
    // Find the block
    let ib = Math.floor(b/B);
    let jb = b%B;
    let m=new Array();
    for (let i=ib*B; i<ib*B+B; i++) {
      for (let j=jb*B; j<jb*B+B; j++) {
        if (this.state[i][j] == X && this.options[i][j].indexOf(n) > -1) {
              m.push({i,j});
        }
      }
    }
    return m;
  }

  // Draws the current state into the html document
  draw() {
    for (let i=1; i<N; i++) {
      document.write("+--");
    }
    document.write("+<br/>");  
    for (let bi=0; bi<B; bi++) {
      for (let i=bi*B; i<bi*B+B; i++) {
        for (let bj=0; bj<B; bj++) {
          document.write("|");
          for (let j=bj*B; j<bj*B+B;j++) {
            document.write(" ");
            document.write(this.state[i][j]);
            document.write(" ");
          }
        }
        document.write("|<br/>");
      }
      for (let i=1; i<N; i++) {
        document.write("+--");
      }
      document.write("+<br/>");  
    }
    document.write("<br/>");
  }
  // Print all the options 
  printOptions() {
    for (let i=0;i<N;i++) {
      for (let j=0;j<N;j++) {
        if (this.state[i][j] == X) {
          document.write("(" + (i+1) + "," + (j+1) + ") : " + this.options[i][j] + "<br/>")
        }
      }
    }
  }
}


