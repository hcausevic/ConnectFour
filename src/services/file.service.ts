import {Point} from '../interfaces/point';
import {GameMode} from '../constants';
import {isSameMove} from '../utils';

class FileService {
  private static fileInstance: FileService;
  private _moves: Array<Point> = [];
  private _gameMode: GameMode | null = null;
  private _currentMoveIndex: number = -1;
  private _overwriteFlag = false;
  private _gameOver: boolean = false;

  private constructor() {
  }

  public static getInstance(): FileService {
    if (!FileService.fileInstance) {
      FileService.fileInstance = new FileService();
    }

    return FileService.fileInstance;
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

    if (this._overwriteFlag && this._moves.length !== 0) {
      if (!isSameMove(this._moves[this.currentMoveIndex + 1], point)) {
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
      gameOver: this._gameOver
    }
  }

  public set gameOver(gameOver: boolean) {
    this._gameOver = gameOver;
  }

  public getPreviousMove(): Point | null {
    if (this._currentMoveIndex > 0) {
      this._overwriteFlag = true;
      return this._moves[--this._currentMoveIndex];
    } else {
      this._currentMoveIndex = -1;
      this._overwriteFlag = false;
      return null;
    }
  }

  public getNextMove(): Point | null {
    this._overwriteFlag = false;
    if (this._currentMoveIndex < this._moves.length - 1) {
      return this._moves[++this._currentMoveIndex];
    } else {
      this._currentMoveIndex = this._moves.length - 1;
      return null;
    }
  }
}

export {
  FileService,
}