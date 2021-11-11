import {Point} from "./interfaces/point";

export const isSameMove = (move1: Point, move2: Point): boolean => {
  return (move1.x === move2.x && move1.y === move2.y
    && move1.player === move2.player);
}