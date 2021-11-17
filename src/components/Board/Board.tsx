import React, {ChangeEvent, useEffect, useState} from 'react';
import Modal from '../Modal';
import './Board.css'
import GameType from '../GameType';
import {GameMode, Player} from '../../constants';
import BoardService from '../../services/board.service';
import Controls from '../Controls';
import GameHistoryService from '../../services/game-history.service';
import FileUpload from '../FileUpload';
import {useDispatch, useSelector} from "react-redux";
import {
  changePlayer,
  initGame,
  makeMove, pickGameMode, redoMove,
  resume,
  selectBoard,
  selectCurrentPlayer,
  selectGameMode,
  selectWinner,
  undoMove
} from '../../reducers/gameSlice';

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const player = useSelector(selectCurrentPlayer);
  const winner = useSelector(selectWinner);
  const gameMode = useSelector(selectGameMode);

  const [showGameTypeModal, setShowGameTypeModal] = useState(true);
  const [showGameModeModal, setShowGameModeModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const history = GameHistoryService.getInstance();

  useEffect(() => {
    setTimeout(() => {
      if (player === Player.BLUE && gameMode === GameMode.PVC) {
        while (true) {
          const random = Math.floor(Math.random() * 6);
          if (BoardService.isLegalMove(board, random)) {
            dispatch(makeMove({column: random, player}));
            break;
          }
        }
      }
    }, 300);
  }, [player])


  const onResetGame = () => {
    dispatch(initGame());
    setShowGameTypeModal(true);
  }

  const onVsPlayer = (): void => {
    dispatch(pickGameMode(GameMode.PVP));
    history.gameMode = GameMode.PVP;
  };

  const onVsComputer = (): void => {
    dispatch(pickGameMode(GameMode.PVC));
    history.gameMode = GameMode.PVC;
  };

  const onResumeGameClick = () => {
    setShowFileUploadModal(true);
    setShowGameTypeModal(false);
  };

  const onCreateGameClick = () => {
    setShowGameModeModal(true);
    setShowGameTypeModal(false);
  };

  const onGameModeConfirmClick = () => {
    setShowGameModeModal(false);
  };

  const onFileChange = (e: ChangeEvent): void => {
    const input = e.target as HTMLInputElement;

    if (input.files?.length) {
      setSelectedFile(input.files[0]);
    }
  };

  const onFileConfirm = async () => {
    dispatch(resume(selectedFile!));
    setShowFileUploadModal(false);
  };

  const onFileRemove = () => {
    setSelectedFile(null);
  };

  const renderCorrectModal = (): React.ReactNode => {
    if (showGameTypeModal) {
      return Modal({
        onPrimaryClick: onResumeGameClick,
        primaryLabel: 'Resume game',
        onSecondaryClick: onCreateGameClick,
        secondaryLabel: 'Create game',
        secondary: true,
        children: (
          <div className="div--centered">
            Do you want to create new game or resume an existing one?
          </div>
        )
      });
    }

    if (showGameModeModal) {
      return Modal({
        onPrimaryClick: onGameModeConfirmClick,
        primaryLabel: 'Confirm',
        primaryDisabled: gameMode === null,
        header: 'Mode selection',
        children: (
          <div className="div--centered">
            <GameType onVsPlayerClick={onVsPlayer} onVsComputerClick={onVsComputer}/>
          </div>
        )
      });
    }

    if (showFileUploadModal) {
      return Modal({
        onPrimaryClick: onFileConfirm,
        primaryLabel: 'Confirm',
        primaryDisabled: selectedFile === null,
        header: 'File selection',
        children: (
          <div className="div--centered">
            <FileUpload selectedFile={selectedFile} onFileChange={onFileChange} onFileRemove={onFileRemove}/>
          </div>
        )
      });
    }

    if (winner) {
      return Modal({
        onPrimaryClick: onResetGame,
        primaryLabel: 'Reset game',
        children: (
          <div className="div--centered">
            Player<span className={"player-color-point player-" + winner}/>has won. Congratulations!
          </div>
        )
      });
    }
  };

  const onUndoClick = (previousMoveIndex: number) => {
    const increment = gameMode === GameMode.PVC ? 2 : 1;
    if (previousMoveIndex === -1) {
      dispatch(initGame());
    } else {
      // depending on the mode, undo 1 or 2 steps
      for (let i = previousMoveIndex + increment; i > previousMoveIndex; i--) {
        const move = history.getMove(i);
        dispatch(undoMove(move));
      }
      const move = history.getMove(previousMoveIndex);
      dispatch(changePlayer(move.player === Player.RED ? Player.BLUE : Player.RED));
    }
  }

  const onRedoClick = (nextMoveIndex: number) => {
    const move = history.getMove(nextMoveIndex);
    const decrement = gameMode === GameMode.PVC ? 1 : 0;
    // depending on the mode, redo 1 or 2 steps
    for (let i = nextMoveIndex - decrement; i <= nextMoveIndex; i++) {
      const move = history.getMove(i);
      dispatch(redoMove(move));
    }
    dispatch(changePlayer(player));
  }

  const onMove = (column: number) => {
    dispatch(makeMove({column, player}));
  }

  return (
    <div className="container">
      {renderCorrectModal()}
      <Controls onUndoClick={onUndoClick} onRedoClick={onRedoClick}/>
      <div className="board">
        {board.map((column: any, i: number) =>
          (
            <div key={i} className="board-row">
              {column.map((row: any, j: number) => (
                <div key={i + j} className="board-cell">
                  <div className={board[i][j] !== null ? "cell-content player-" + board[i][j].player : "cell-content"}
                       onClick={() => onMove(j)}>
                  </div>
                </div>
              ))}
            </div>)
        )}
      </div>
      <div className="player-container">
        <label>PLAYER</label>
        <span className={"player-color-point player-" + player}/>
      </div>
    </div>
  )
}

export default Board;
