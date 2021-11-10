import React from 'react';
import {FaSave, IoIosRedo, IoIosUndo} from 'react-icons/all';
import './Controls.css';
import {FileService} from "../../services/file.service";
import {Point} from "../../interfaces/point";

interface ControlsProps {
  onUndoClick: (prevMove: Point | null) => void;
  onRedoClick: (nextMove: Point | null) => void;
}

const Controls = ({onUndoClick, onRedoClick}: ControlsProps) => {

  const file = FileService.getInstance();

  const undoMove = () => {
    onUndoClick(file.getPreviousMove());
  }

  const redoMove = () => {
    onRedoClick(file.getNextMove());
  }

  const saveGame = () => {
    //TODO;
  }

  const redoDisabled = file.currentMoveIndex >= file.movesListLength - 1;
  const undoDisabled = file.currentMoveIndex < 0;

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
      <button title="Save game" className="btn--ctrl" onClick={saveGame}>
        <FaSave/>
      </button>
    </div>
  );
}

export default Controls;