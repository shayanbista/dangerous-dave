import { Character } from "./Character";
import { GameEntity } from "./GameEntity";
import { TILE_SIZE } from "./constant";
import { Tile } from "./tiles/tile";

export class Bullet extends GameEntity {
  vel: number;
  user: Character;
  direction: any;
  bulletImage: HTMLImageElement;
  isActive: boolean;
  constructor(posX: number, posY: number, user: Character, vel: number, direction: number) {
    super({
      posX,
      posY,
      width: 16,
      height: 16,
    });

    this.vel = vel;
    this.user = user;
    this.direction = direction;
    this.bulletImage = new Image();
    this.bulletImage.src = "./assets/sprites/banner.png";
    this.isActive = false;
  }

  update() {
    this.posX += this.direction * this.vel;
    if (this.posX < 0 || this.posX > 800) this.isActive = false;
  }

  draw(ctx: CanvasRenderingContext2D, viewX: number, viewY: number, spriteX: number) {
    // let spriteY = 17 * TILE_SIZE;
    let spriteY = 5 * TILE_SIZE;
    ctx.drawImage(
      this.bulletImage,
      spriteX * TILE_SIZE,
      spriteY,
      Tile.size,
      Tile.size,
      this.posX + 30 - viewX,
      this.posY - viewY,
      this.width,
      this.height
    );
  }

  // shoot() {
  //   if (this.direction == 1) {
  //     this.bullet = new Bullet(this.posX, this.posY, this.user, this.vel, 1);
  //     return this.bullet;
  //   }
  // }
}
