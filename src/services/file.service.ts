import {Point} from "../interfaces/point";
import {GameMode} from "../constants";

class FileService {
  private static fileInstance: FileService;
  private _moves: Array<Point> = [];
  private _gameMode: GameMode | null = null;
  private _currentMoveIndex: number = -1;

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
    this._moves.push(point);
    this._currentMoveIndex = this._moves.length - 1;
  }

  public get currentMoveIndex() {
    return this._currentMoveIndex;
  }

  public getPreviousMove(): Point | null {
    return this._currentMoveIndex > -1 ?
      this._moves[--this._currentMoveIndex] :
      null;
  }

  public getNextMove(): Point | null {
    return this._currentMoveIndex < this._moves.length - 1 ?
      this._moves[++this._currentMoveIndex] :
      null;
  }

  public loadFromFile(moves: Array<Point>, gameMode: GameMode): void {
    this._moves = moves;
    this._gameMode = gameMode;
    this._currentMoveIndex = moves.length - 1;
  }
}

export {
  FileService,
}