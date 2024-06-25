import { GameEntity } from "./GameEntity";
import { TILE_SIZE } from "../constant";
import { Tile } from "./tiles/Tile";
import { Bullet } from "./Bullet";
import { Direction } from "../utility";
export class Enemy extends GameEntity {
  direction: Direction;
  enemyImage: HTMLImageElement;
  movementState: number;
  initialPosX: number;
  initialPosY: number;
  counter: number;
  delay: number;
  bullets: Bullet[] = [];
  lastShotTime: number;
  shootingInterval: number;

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
    this.lastShotTime = 0;
    this.shootingInterval = 3000;
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
    this.bullets.forEach((bullet) => bullet.update());
    this.bullets = this.bullets.filter((bullet) => bullet.isActive);

    const currentTime = Date.now();
    if (currentTime - this.lastShotTime >= this.shootingInterval) {
      this.shoot();
      this.lastShotTime = currentTime;
    }
  }

  shoot() {
    const bullet = new Bullet(this.posX, this.posY, this, 5, this.direction);
    bullet.isActive = true;
    this.bullets.push(bullet);
  }

  draw(ctx: CanvasRenderingContext2D, viewX: number, viewY: number) {
    ctx.drawImage(this.enemyImage, 2 * 64, 10 * 64, Tile.size, Tile.size, this.posX - viewX, this.posY - viewY, 50, 50);
    this.bullets.forEach((bullet) => bullet.draw(ctx, viewX, viewY));
  }
}
