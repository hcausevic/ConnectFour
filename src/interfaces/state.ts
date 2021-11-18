import {Point} from './point';
import {GameMode, Player, Status} from '../constants';

export interface State {
  board: Array<Array<Point | null>>;
  status: Status,
  winner: Player | null,
  currentPlayer: Player,
  gameMode: GameMode | null,
}