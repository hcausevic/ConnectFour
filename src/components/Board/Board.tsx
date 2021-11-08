import React from 'react';
import Modal from '../Modal';
import './Board.css'
import {
  FaSave,
  IoIosRedo,
  IoIosUndo,
} from "react-icons/all";

class Board extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      board: new Array(6).fill(new Array(7).fill(null)),
      player: 1,
      showModal: true,
    }
  }

  onModalClose = () => {
    this.setState({showModal: false});
  }

  makeMove(row: number, column: number) {
    console.log('clicked on cell: ', row, column)
  }

  render() {
    const {board, player} = this.state;
    return (
      <div className="container">
        { this.state.showModal && (
          <Modal onPrimaryClick={this.onModalClose} primaryLabel="Close">
            <h1>MODAL CONTENT!</h1>
          </Modal>
        )}
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
              <div key={i} className='column'>
                {column.map((row: any, j: number) => (
                  <div key={i + j} className='cell'>
                    <div className='content' onClick={() => this.makeMove(i, j)}>
                      cell ({i}, {j})
                    </div>
                  </div>
                ))}
              </div>)
          )}
        </div>
        <div className="player-container">
          <label className="player-label">PLAYER {player}</label>
          <span className="player-color"/>
        </div>
      </div>
    )
  }
}

export default Board;
