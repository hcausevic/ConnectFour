import React, {ChangeEvent, useEffect, useState} from 'react';
import Modal from '../Modal';
import './Board.css'
import GameType from '../GameType';
import {GameMode, Player} from '../../constants';
import BoardService from '../../services/board.service';
import Controls from '../Controls';
import GameHistoryService from '../../services/gameHistory.service';
import {Point} from '../../interfaces/point';
import FileUpload from '../FileUpload';

const Board = () => {
  const [board, setBoard] = useState(Array.from(Array(6), () => new Array(7).fill(null)));
  const [player, setPlayer] = useState<Player>(Player.RED);
  const [currentMove, setCurrentMove] = useState<Point | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [showGameTypeModal, setShowGameTypeModal] = useState(true);
  const [showGameModeModal, setShowGameModeModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const history = GameHistoryService.getInstance();

  useEffect(() => {
    if (player === Player.BLUE && gameMode === GameMode.PVC) {
      // currently the computer player makes only random moves
      // TODO; add some decisioning
      while (true) {
        const random = Math.floor(Math.random() * 6);
        if (BoardService.isLegalMove(board, random)) {
          makeMove(random);
          break;
        }
      }
    }
    // eslint-disable-next-line
  }, [player])

  const makeMove = (column: number): void => {
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i][column] === null) {
        // set move
        const move = {x: i, y: column, player};
        board[i][column] = move;
        history.lastMove = move;
        setCurrentMove(move);
        // check for winner
        const winner = BoardService.getWinner(board, i, column)
        setWinner(winner);
        if (winner) history.gameOver = true;

        // switch player if there is no winner
        if (!winner) {
          player === Player.RED ? setPlayer(Player.BLUE) : setPlayer(Player.RED);
        }
        break;
      }
    }
  }

  const onResetGame = () => {
    clearBoard();
    setShowGameTypeModal(true);
  }

  const clearBoard = () => {
    setBoard(Array.from(Array(6), () => new Array(7).fill(null)));
    setPlayer(Player.RED);
    setWinner(null);
    setCurrentMove(null);
    setGameMode(null);
  };

  const onVsPlayer = (): void => {
    setGameMode(GameMode.PVP);
    history.gameMode = GameMode.PVP;
  };

  const onVsComputer = (): void => {
    setGameMode(GameMode.PVC);
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

  const onFileConfirm = () => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', e => {
      const a = JSON.parse(e.target?.result as string);
      const newBoard = Array.from(Array(6), () => new Array(7).fill(null));
      for (const move of a.moves) {
        newBoard[move.x][move.y] = move;
      }
      history.createFromData(a.moves, a.gameMode, a.gameOver);
      setGameMode(a.gameMode);
      setCurrentMove(a.moves[a.moves.length - 1]);
      setBoard(newBoard);
    });
    fileReader.readAsText(selectedFile!);
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

  const onUndoClick = (previousMove: Point | null) => {
    if (currentMove) {
      board[currentMove.x][currentMove.y] = null;
    }
    setCurrentMove(previousMove);
    setPlayer(previousMove ?
      previousMove.player === Player.RED ?
        Player.BLUE :
        Player.RED :
      Player.RED);
  }

  const onRedoClick = (nextMove: Point | null) => {
    if (nextMove) {
      board[nextMove.x][nextMove.y] = nextMove;
      setCurrentMove(nextMove);
      // @ts-ignore
      setPlayer(nextMove ?
        nextMove.player === Player.RED ?
          Player.BLUE :
          Player.RED :
        currentMove?.player);
    }
  }

  return (
    <div className="container">
      {renderCorrectModal()}
      <Controls onUndoClick={onUndoClick} onRedoClick={onRedoClick}/>
      <div className="board">
        {board.map((column, i: number) =>
          (
            <div key={i} className="board-row">
              {column.map((row: any, j: number) => (
                <div key={i + j} className="board-cell">
                  <div className={board[i][j] !== null ? "cell-content player-" + board[i][j].player : "cell-content"}
                       onClick={() => makeMove(j)}>
                    {/*({i}, {j})*/}
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
