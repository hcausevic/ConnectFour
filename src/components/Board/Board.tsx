import React from 'react';
import Modal from '../Modal';
import './Board.css'
import {
  FaSave,
  IoIosRedo,
  IoIosUndo,
} from "react-icons/all";
import {Player} from "../../services/game";
import {Point} from "../../interfaces/point";

class Board extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      board: Array.from(Array(6), () => new Array(7).fill(null)),
      player: Player.RED, // red plays first // red is new white
      winner: null
    }
  }

  togglePlayer(): void {
    this.state.player === Player.RED ?
      this.setState({player: Player.BLUE}) :
      this.setState({player: Player.RED});
  }

  makeMove(column: number): void {
    const {board, player} = this.state;
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i][column] === null) {
        board[i][column] = {x: i, y: column, player};
        this.checkBoard(i, column);
        this.togglePlayer();
        break;
      }
    }
  }

  setWinner(winner: Player) {
    this.setState({winner});
  }

  checkBoard(row: number, column: number): void {

    // possible directions
    const {board} = this.state;
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
        return;
      }
    }
    if (right) {
      if (this.hasWon(board, column + 1, row, color, (j: number) => ++j, (i: number) => i)) {
        this.setWinner(color);
        return;
      }
    }
    if (up) {
      if (this.hasWon(board, column, row - 1, color, (j: number) => j, (i: number) => --i)) {
        this.setWinner(color);
        return;
      }
    }
    if (down) {
      if (this.hasWon(board, column, row + 1, color, (j: number) => j, (i: number) => ++i)) {
        this.setWinner(color);
        return;
      }
    }
    if (upLeft) {
      if (this.hasWon(board, column - 1, row - 1, color, (j: number) => --j, (i: number) => --i)) {
        this.setWinner(color);
        return;
      }
    }
    if (upRight) {
      if (this.hasWon(board, column + 1, row - 1, color, (j: number) => ++j, (i: number) => --i)) {
        this.setWinner(color);
        return;
      }
    }
    if (downLeft) {
      if (this.hasWon(board, column - 1, row + 1, color, (j: number) => --j, (i: number) => ++i)) {
        this.setWinner(color);
        return;
      }
    }
    if (downRight) {
      if (this.hasWon(board, column + 1, row + 1, color, (j: number) => ++j, (i: number) => ++i)) {
        this.setWinner(color);
        return;
      }
    }
  }

  hasWon(board: Array<Array<Point>>,
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
    if (tokenNum === 4) {
      console.log('WIN');
      return true;
    }
    return false;
  }

  render() {
    const {board, player, winner} = this.state;
    return (
      <div className="container">
        <Modal/>
        {winner ? <Modal/> : null}
        <div className="controls-top">
          <div className="undo-redo-container">
            <button title="Undo" className="ctrl-btn" style={{marginRight: '10%'}}><IoIosUndo/></button>
            <button title="Redo" className="ctrl-btn"><IoIosRedo/></button>
          </div>
          <button title="Save game" className="ctrl-btn"><FaSave/></button>
        </div>
        <div className="board">
          {board.map((column: [], i: number) =>
            (
              <div key={i} className='board-row'>
                {column.map((row: any, j: number) => (
                  <div key={i + j} className="board-cell">
                    <div className={board[i][j] !== null ? "cell-content player-" + board[i][j].player : "cell-content"}
                         onClick={() => this.makeMove(j)}>
                    </div>
                  </div>
                ))}
              </div>)
          )}
        </div>
        <div className="player-container">
          <label className="player-label">PLAYER</label>
          <span className={"player-color-point player-" + player}/>
        </div>
      </div>
    )
  }
}

export default Board;
