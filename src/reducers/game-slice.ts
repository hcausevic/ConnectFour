import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GameBuilder} from '../services/game.service';
import BoardService from '../services/board.service';
import {Player, Status} from '../constants';
import GameHistoryService from '../services/game-history.service';
import {Point, State} from '../interfaces';

const initBoard = () => Array.from(Array(6), () => new Array(7).fill(null));

const initialState: State = {
  ...(new GameBuilder().build()),
  status: Status.FULFILLED,
  board: initBoard(),
  winner: null,
  currentPlayer: Player.RED,
  gameMode: null,
};

export const resume = createAsyncThunk(
  'game/resumeGame',
  async (file: File) => await new GameBuilder().addFromFile(file)
);

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGame: (state) => {
      state.board = initBoard();
      state.status = Status.FULFILLED;
      state.winner = null;
      state.currentPlayer = Player.RED;
      state.gameMode = null;
    },
    makeMove: (state, action) => {
      const {board} = state;
      const {column, player} = action.payload;
      for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][column] === null) {
          const history = GameHistoryService.getInstance();
          // set move
          const move = {x: i, y: column, player};
          board[i][column] = move;
          history.lastMove = move;
          // check for winner
          const winner = BoardService.getWinner(state.board as any, i, column)
          state.winner = winner;
          if (winner) history.gameOver = true;

          // switch player if there is no winner
          if (!winner) {
            state.currentPlayer === Player.RED ? state.currentPlayer = Player.BLUE : state.currentPlayer = Player.RED;
          }
          break;
        }
      }
    },
    undoMove: (state, action: PayloadAction<Point>) => {
      const {x, y} = action.payload;
      state.board[x][y] = null;
    },
    redoMove: (state, action: PayloadAction<Point>) => {
      const {x, y} = action.payload;
      state.board[x][y] = action.payload;
    },
    changePlayer: (state, action: PayloadAction<Player>) => {
      state.currentPlayer = action.payload;
    },
    pickGameMode: (state, action) => {
      state.gameMode = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(resume.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(resume.fulfilled, (state, action) => {
        const history = GameHistoryService.getInstance();
        const game = action.payload.build();
        history.createFromData(game.moves, game.gameMode!);
        const board = initBoard();
        for (const m of game.moves) board[m.x][m.y] = m;
        state.winner = null;
        state.board = board;
        state.gameMode = game.gameMode;
        state.currentPlayer = game.currentPlayer;
        state.status = Status.FULFILLED;
      });
  }
});

export const selectMoves = (state: any) => state.game.moves;
export const selectBoard = (state: any) => state.game.board;
export const selectCurrentPlayer = (state: any) => state.game.currentPlayer;
export const selectWinner = (state: any) => state.game.winner;
export const selectGameMode = (state: any) => state.game.gameMode;

export const {initGame, makeMove, changePlayer, redoMove, pickGameMode, undoMove} = gameSlice.actions;

export default gameSlice.reducer;
