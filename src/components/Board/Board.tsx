import React, {ChangeEvent, useState} from 'react';
import Modal from '../Modal';
import './Board.css'
import GameType from '../GameType';
import {GameMode} from '../../constants';
import {Player} from '../../services/game.service';
import BoardService from '../../services/board.service';
import Controls from '../Controls';
import {FileService} from "../../services/file.service";
import {Point} from "../../interfaces/point";
import FileUpload from "../FileUpload";

const Board = () => {
  const [board, setBoard] = useState(Array.from(Array(6), () => new Array(7).fill(null)));
  const [player, setPlayer] = useState<Player>(Player.RED);
  const [currentMove, setCurrentMove] = useState<Point | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [showGameTypeModal, setShowGameTypeModal] = useState(true);
  const [showGameModeModal, setShowGameModeModal] = useState(false);
  const [file] = useState<FileService>(FileService.getInstance());
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onModalClose = (): void => {
    setShowGameTypeModal(false);
  }

  console.log('Board: ', board);

  const makeMove = (column: number): void => {
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i][column] === null) {
        const move = {x: i, y: column, player};
        board[i][column] = move;
        file.lastMove = move;
        console.log('file', file)
        setCurrentMove(move);
        setWinner(BoardService.getWinner(board, i, column));
        player === Player.RED ? setPlayer(Player.BLUE) : setPlayer(Player.RED);
        break;
      }
    }
  }

  const onVsPlayer = (): void => {
    setGameMode(GameMode.PVP);
    file.gameMode = GameMode.PVP;
  };

  const onVsComputer = (): void => {
    setGameMode(GameMode.PVC);
    file.gameMode = GameMode.PVC;
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
      setBoard(newBoard);
      file.loadFromFile(a.moves, a.gameMode);
      // setGameMode(a.gameMode);
    })
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
        header: 'File selection',
        children: (
          <div className="div--centered">
            <FileUpload selectedFile={selectedFile} onFileChange={onFileChange} onFileRemove={onFileRemove}/>
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

  return (
    <div className="container">
      {renderCorrectModal()}
      {winner && (
        //@ts-ignore
        <Modal onPrimaryClick={() => setWinner(null)} primaryLabel="Reset game"/>
      )}
      <Controls onUndoClick={onUndoClick}/>
      <div className="board">
        {board.map((column, i: number) =>
          (
            <div key={i} className="board-row">
              {column.map((row: any, j: number) => (
                <div key={i + j} className="board-cell">
                  <div className={board[i][j] !== null ? "cell-content player-" + board[i][j].player : "cell-content"}
                       onClick={() => makeMove(j)}>
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

export default Board;
