import { solidTiles } from "./game";
import { Tile } from "./tile";


export class GameEntity {
  game: any;
  posX: number;
  posY: number;
  width: number;
  height: number;

  constructor(
    game: any,
    posX: number,
    posY: number,
    width: number,
    height: number
  ) {
    this.game = game;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
  }

  Edges() {
    let edges = {
      left: this.posX,
      right: this.posX + this.width,
      top: this.posY,
      bottom: this.posY + this.height,
    };
    return edges;
  }

  isColliding() {
    console.log
  }


}
