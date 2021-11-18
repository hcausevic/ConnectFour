import {Point} from '../interfaces/point';
import {GameMode, Player} from '../constants';
import {readFileAsync} from "../utils/file";

class Game {
  public moves: Array<Point> = [];
  public gameMode: GameMode | null = null;
  public currentPlayer: Player = Player.RED;
}

class GameBuilder {
  private game: Game = new Game();

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.game = new Game();
  }

  public addCurrentPlayer(player: Player): GameBuilder {
    this.game.currentPlayer = player;
    return this;
  }

  public addMoves(moves: Array<Point>): GameBuilder {
    this.game.moves = moves;
    return this;
  }

  public addGameMode(gameMode: GameMode): GameBuilder {
    this.game.gameMode = gameMode;
    return this;
  }

  public async addFromFile(file: File): Promise<GameBuilder> {
    const json = JSON.parse(await readFileAsync(file));
    return this.addMoves(json.moves)
      .addCurrentPlayer(json.moves.length % 2 === 0 ? Player.RED : Player.BLUE)
      .addGameMode(json.gameMode);
  }

  public build(): Game {
    const result = this.game;
    this.reset();
    return result;
  }
}

export {
  Game,
  GameBuilder,
}
