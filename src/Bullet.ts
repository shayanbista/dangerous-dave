import { Character } from "./Character";
import { GameEntity } from "./GameEntity";

export class Bullet extends GameEntity {
  vel: number;
  user: Character;
  direction: any;
  constructor(posX: number, posY: number, user: Character, vel: number, direction: number) {
    super({
      posX,
      posY,
      width: 20,
      height: 10,
    });

    this.vel = vel;
    this.user = user;
    this.direction = direction;
  }

  update() {
    this.posX += this.direction * this.vel;
  }

  // draw(ctx: CanvasRenderingContext2D) {
}
// }
