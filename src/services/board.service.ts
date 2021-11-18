import {Point} from '../interfaces';
import {Player} from '../constants';

class BoardService {
  public static getWinner(board: Array<Array<Point>>, row: number, column: number): Player | null {
    // possible directions
    const color = board[row][column].player;
    const left = column - 3 >= 0;
    const right = column + 3 <= board[row].length - 1;
    const up = row - 3 >= 0;
    const down = row + 3 <= board.length - 1;
    const upLeft = row - 3 >= 0 && column - 3 >= 0;
    const upRight = column + 3 <= board[row].length - 1 && row - 3 >= 0;
    const downLeft = row + 3 <= board.length - 1 && column - 3 >= 0;
    const downRight = row + 3 <= board.length - 1 && column + 3 <= board[row].length - 1;

    // find 4 of the same colour
    if (left) {
      if (this.hasWon(board, column - 1, row, color, (j: number) => --j, (i: number) => i)) {
        return color;
      }
    }
    if (right) {
      if (this.hasWon(board, column + 1, row, color, (j: number) => ++j, (i: number) => i)) {
        return color;
      }
    }
    if (up) {
      if (this.hasWon(board, column, row - 1, color, (j: number) => j, (i: number) => --i)) {
        return color;
      }
    }
    if (down) {
      if (this.hasWon(board, column, row + 1, color, (j: number) => j, (i: number) => ++i)) {
        return color;
      }
    }
    if (upLeft) {
      if (this.hasWon(board, column - 1, row - 1, color, (j: number) => --j, (i: number) => --i)) {
        return color;
      }
    }
    if (upRight) {
      if (this.hasWon(board, column + 1, row - 1, color, (j: number) => ++j, (i: number) => --i)) {
        return color;
      }
    }
    if (downLeft) {
      if (this.hasWon(board, column - 1, row + 1, color, (j: number) => --j, (i: number) => ++i)) {
        return color;
      }
    }
    if (downRight) {
      if (this.hasWon(board, column + 1, row + 1, color, (j: number) => ++j, (i: number) => ++i)) {
        return color;
      }
    }
    return null;
  }

  public static isLegalMove(board: Array<Array<Point>>, column: number) {
    for (let i = 0; i < board.length; ++i) {
      if (board[i][column] === null) {
        return true;
      }
    }
    return false;
  }

  private static hasWon(board: Array<Array<Point>>,
                        j: number,
                        i: number,
                        color: Player,
                        jOperation: (j: number) => number,
                        iOperation: (i: number) => number): boolean {

    // check for the-same coloured neighbour
    let tokenNum = 1;
    let counter = 3;
    while (counter > 0) {
      if (board[i][j] && color === board[i][j].player) {
        tokenNum++;
      }
      counter--;
      j = jOperation(j);
      i = iOperation(i);
    }
    return tokenNum === 4;
  }

  public static isSameMove = (move1: Point, move2: Point): boolean => {
    return (move1.x === move2.x && move1.y === move2.y
      && move1.player === move2.player);
  }
}

export default BoardService;