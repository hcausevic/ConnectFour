import {Point} from '../interfaces/point';
import {Player} from '../constants';

class GameService {
  public positions: Array<Point> = [];
  public moves: Array<Point> = [];
  public firstMove: Player = Player.RED;
}

class GameBuilder {
  private game: GameService = new GameService();

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.game = new GameService();
  }

  public addPositions(positions: Array<Point>): GameBuilder {
    this.game.positions = positions;
    return this;
  }

  public addFirstPlayer(player: Player): GameBuilder {
    this.game.firstMove = player;
    return this;
  }

  public addMoves(moves: Array<Point>): GameBuilder {
    this.game.moves = moves;
    return this;
  }

  public build(): GameService {
    const result = this.game;
    this.reset();
    return result;
  }
}

export {
  GameService,
  GameBuilder,
}
