import React from 'react';
import {FaSave, IoIosRedo, IoIosUndo} from 'react-icons/all';
import './Controls.css';
import GameHistoryService from '../../services/gameHistory.service';
import {Point} from '../../interfaces/point';

interface ControlsProps {
  onUndoClick: (prevMove: Point | null) => void;
  onRedoClick: (nextMove: Point | null) => void;
}

const Controls = ({onUndoClick, onRedoClick}: ControlsProps) => {
  const history = GameHistoryService.getInstance();
  const undoMove = () => {
    onUndoClick(history.getPreviousMove());
  }

  const redoMove = () => {
    onRedoClick(history.getNextMove());
  }

  const saveGame = () => {
    const a = document.createElement("a");
    const fileToDownload = new Blob([JSON.stringify(history.exportContent)], {type: 'application/json'});

    a.href = URL.createObjectURL(fileToDownload);
    a.download = `Connect4_game${Math.floor(Math.random() * 100000)}`;
    a.click();
  }

  const redoDisabled = history.currentMoveIndex >= history.movesListLength - 1;
  const undoDisabled = history.currentMoveIndex < 0;
  const saveDisabled = history.currentMoveIndex < 0;

  return (
    <div className="controls">
      <div className="controls__btn-container">
        <button title="Undo"
                className="btn--ctrl"
                style={{marginRight: '10%'}}
                onClick={undoMove}
                disabled={undoDisabled}>
          <IoIosUndo/>
        </button>
        <button title="Redo" className="btn--ctrl" onClick={redoMove} disabled={redoDisabled}>
          <IoIosRedo/>
        </button>
      </div>
      <button title="Save game" className="btn--ctrl" onClick={saveGame} disabled={saveDisabled}>
        <FaSave/>
      </button>
    </div>
  );
}

export default Controls;