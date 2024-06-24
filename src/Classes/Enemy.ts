import { GameEntity } from "./GameEntity";
import { TILE_SIZE } from "../constant";
import { Tile } from "./tiles/Tile";

export class Enemy extends GameEntity {
  direction: number;
  enemyImage: HTMLImageElement;
  movementState: any;
  initialPosX: number;
  initialPosY: number;
  counter: number;
  delay: number;

  constructor(posX: number, posY: number) {
    super({
      posX,
      posY,
      width: TILE_SIZE,
      height: TILE_SIZE,
    });

    this.counter = 0;
    this.movementState = 0;
    this.direction = -1;
    this.initialPosX = posX;
    this.initialPosY = posY;
    this.delay = 20;
    this.enemyImage = new Image();
    this.enemyImage.src = "./assets/sprites/tileset.png";
  }

  update() {
    this.counter++;
    if (this.counter > this.delay) {
      switch (this.movementState) {
        case 0:
          this.posX = this.initialPosX - TILE_SIZE;
          this.posY = this.initialPosY;
          break;
        case 1:
          this.posX = this.initialPosX - TILE_SIZE;
          this.posY = this.initialPosY - TILE_SIZE;
          break;
        case 2:
          this.posX = this.initialPosX;
          this.posY = this.initialPosY - TILE_SIZE;
          break;
        case 3:
          this.posX = this.initialPosX;
          this.posY = this.initialPosY;
          break;
      }

      this.movementState = (this.movementState + 1) % 4;
      this.counter = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, viewX: number, viewY: number) {
    ctx.drawImage(this.enemyImage, 2 * 64, 10 * 64, Tile.size, Tile.size, this.posX - viewX, this.posY - viewY, 50, 50);
  }
}
