import {Point} from '../interfaces/point';
import {GameMode} from '../constants';
import BoardService from "./board.service";

class GameHistoryService {
  private static history: GameHistoryService;
  private _moves: Array<Point> = [];
  private _gameMode: GameMode | null = null;
  private _currentMoveIndex: number = -1;
  private _gameOver: boolean = false;

  private constructor() {
  }

  public static getInstance(): GameHistoryService {
    if (!GameHistoryService.history) {
      GameHistoryService.history = new GameHistoryService();
    }

    return GameHistoryService.history;
  }

  public get gameMode() {
    return this._gameMode;
  }

  public set gameMode(type: GameMode | null) {
    this._gameMode = type;
  }

  public set lastMove(point: Point) {
    if (this._currentMoveIndex === -1) {
      this._moves = [];
    }

    if (this._moves.length !== 0 && this.currentMoveIndex !== this._moves.length - 1) {
      if (!BoardService.isSameMove(this._moves[this.currentMoveIndex + 1], point)) {
        this._moves[this.currentMoveIndex + 1] = point;
        this._moves = this._moves.slice(0, this.currentMoveIndex + 2);
      }
    } else {
      this._moves.push(point);
    }

    this._currentMoveIndex++;
  }

  public get currentMoveIndex() {
    return this._currentMoveIndex;
  }

  public get movesListLength() {
    return this._moves.length;
  }

  public get exportContent() {
    return {
      gameMode: this.gameMode,
      moves: this._moves.slice(0, this.currentMoveIndex + 1),
    }
  }

  public set gameOver(gameOver: boolean) {
    this._gameOver = gameOver;
  }

  public getPreviousMoveIndex(): number {
    if (this.gameMode === GameMode.PVC) {
      this._currentMoveIndex > 1 ?
        this._currentMoveIndex -= 2 :
        this._currentMoveIndex = -1;
    } else {
      this._currentMoveIndex > 0 ?
        --this._currentMoveIndex :
        this._currentMoveIndex = -1;
    }
    return this._currentMoveIndex;
  }

  public getNextMove(): number {
    if (this.gameMode === GameMode.PVC) {
      this._currentMoveIndex < this._moves.length - 2 ?
        this._currentMoveIndex += 2 :
        this._currentMoveIndex = this._moves.length - 1;
    } else {
      this._currentMoveIndex < this._moves.length - 1 ?
        ++this._currentMoveIndex :
        this._currentMoveIndex = this._moves.length - 1;
    }
    return this._currentMoveIndex;
  }

  public getMove(index: number): Point {
    return this._moves[index];
  }

  public createFromData(moves: Array<Point>, gameMode: GameMode): void {
    this._moves = moves;
    this._gameMode = gameMode;
    this._currentMoveIndex = moves.length - 1;
  }
}

export default GameHistoryService;