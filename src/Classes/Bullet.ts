import { Character } from "./Character";
import { GameEntity } from "./GameEntity";
import { TILE_SIZE } from "../constant";
import { Tile } from "./tiles/Tile";
import { Enemy } from "./Enemy";
import { Direction } from "../utility";

export class Bullet extends GameEntity {
  vel: number;
  user: Character | Enemy;
  direction: Direction;
  bulletImage: HTMLImageElement;
  isActive: boolean;

  constructor(posX: number, posY: number, user: Character | Enemy, vel: number, direction: Direction) {
    super({
      posX,
      posY,
      width: TILE_SIZE,
      height: TILE_SIZE,
    });

    this.vel = vel;
    this.user = user;
    this.direction = direction;
    this.bulletImage = new Image();
    this.bulletImage.src = "./assets/sprites/tileset.png";
    this.isActive = false;
  }

  update() {
    this.posX += this.direction * this.vel;
  }

  draw(ctx: CanvasRenderingContext2D, viewX: number, viewY: number) {
    ctx.drawImage(
      this.bulletImage,
      0.8 * TILE_SIZE,
      17.6 * TILE_SIZE,
      Tile.size,
      Tile.size,
      this.posX + 30 - viewX,
      this.posY - viewY,
      15,
      15
    );
  }

  checkCollision(entity: GameEntity): boolean {
    const bulletLeft = this.posX;
    const bulletRight = this.posX + this.width;
    const bulletTop = this.posY;
    const bulletBottom = this.posY + this.height;

    const entityLeft = entity.posX;
    const entityRight = entity.posX + entity.width;
    const entityTop = entity.posY;
    const entityBottom = entity.posY + entity.height;

    return bulletLeft < entityRight && bulletRight > entityLeft && bulletTop < entityBottom && bulletBottom > entityTop;
  }
}
