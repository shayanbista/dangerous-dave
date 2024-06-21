import { GameEntity } from "./gameEntity";
import { Tile } from "./tile";

import { TILE_SIZE } from "./constant";
import { SolidTile } from "./SolidTile";
import { EdibleTile } from "./edibleTIle";

interface InputKeys {
  right: { hold: boolean };
  left: { hold: boolean };
  up: { hold: boolean };
}

export class Character extends GameEntity {
  velX: number;
  velY: number;
  direction: number;
  jumping: boolean;
  canJump: boolean = true;
  jumpTarget: number;
  animationFrame: number;
  spriteImage: HTMLImageElement;
  keys: InputKeys;
  gravity: number;
  private JUMP_SPEED = -15;
  grounded: boolean = false;
  colliding: boolean = false;
  isCollidingRight: boolean = false;
  isCollidingLeft: boolean = false;
  score: number;
  isDoor: boolean;

  constructor(
    posX: number,
    posY: number,
    solidTiles: SolidTile[] = [],
    edibleTiles: EdibleTile[] = []
  ) {
    super({
      posX,
      posY,
      width: Tile.size - 4,
      height: Tile.size,
      solidTiles,
      edibleTiles,
    });
    this.velX = 0;
    this.velY = 0;
    this.direction = 1;
    this.jumping = false;
    this.jumpTarget = 0;
    this.animationFrame = 0;
    this.gravity = 0.2;
    this.colliding = false;
    this.score = 0;
    this.isDoor = false;

    this.spriteImage = new Image();
    this.spriteImage.src = "assets/sprites/tileset.png";

    this.keys = {
      right: { hold: false },
      left: { hold: false },
      up: { hold: false },
    };

    this.initializeControls(this.keys);
  }

  initializeControls(keys: InputKeys) {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        keys.right.hold = true;
        this.direction = 1;
        if (!this.jumping) this.animationFrame = (this.animationFrame + 1) % 4;
      } else if (e.key === "ArrowLeft") {
        keys.left.hold = true;
        this.direction = -1;
        if (!this.jumping) this.animationFrame = (this.animationFrame + 1) % 4;
      } else if (e.key === "ArrowUp" && this.grounded) {
        this.velY -= 2;
        this.jumping = true;
        this.canJump = false;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight") {
        keys.right.hold = false;
      } else if (e.key === "ArrowLeft") {
        keys.left.hold = false;
      } else if (e.key === "ArrowUp" && !this.jumping) {
        this.velY = this.JUMP_SPEED;
        this.jumping = true;
      }
    });
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number = this.posX,
    y: number = this.posY,
    dw: number = Tile.size,
    dh: number = Tile.size
  ) {
    const spriteWidth = Tile.size;
    const spriteHeight = Tile.size;
    let spriteX: number;
    let spriteY: number;

    if (this.direction === 1) {
      spriteX = ((this.animationFrame % 4) + 1) * spriteWidth;
      spriteY = 2 * spriteHeight;
    } else {
      spriteX = ((this.animationFrame % 4) + 5) * spriteWidth;
      spriteY = 2 * spriteHeight;
    }

    ctx.drawImage(
      this.spriteImage,
      spriteX,
      spriteY,
      spriteWidth,
      spriteHeight,
      x,
      y,
      dw,
      dh
    );
  }

  update() {
    const speed = 2.5;
    if (this.grounded == false) {
      this.velY += 0.04;
      this.canJump = false;
    }

    this.posY += this.velY;

    if (this.keys.left.hold) {
      this.posX -= speed;
      this.direction = -1;
    }

    if (this.keys.right.hold) {
      this.posX += speed;
      this.direction = 1;
    }

    if (this.jumping) {
      this.posY += this.velY;
      this.canJump = false;
      this.grounded = false;
    }

    this.handleCollision();
  }

  handleCollision() {
    const playerRect = {
      left: this.posX + 20,
      right: this.posX + TILE_SIZE - 20,
      top: this.posY + 5,
      bottom: this.posY + TILE_SIZE - 5,
    };
    this.grounded = false;

    for (let tile of this.solidTiles) {
      const tileRect = {
        left: tile.x,
        right: tile.x + TILE_SIZE,
        top: tile.y,
        bottom: tile.y + TILE_SIZE,
      };

      const groundCheckRect = {
        left: this.posX + 20,
        right: this.posX + TILE_SIZE - 20,
        top: this.posY + TILE_SIZE - 10,
        bottom: this.posY + TILE_SIZE + 10,
      };

      this.grounded = isColliding(groundCheckRect, tileRect)
        ? true
        : this.grounded;
      if (isColliding(playerRect, tileRect)) {
        if (playerRect.bottom > tileRect.top && playerRect.top < tileRect.top) {
          this.posY = tileRect.top - TILE_SIZE;
          this.velY = 0;
          this.jumping = false;
        } else if (
          playerRect.top < tileRect.bottom &&
          playerRect.bottom > tileRect.bottom
        ) {
          this.posY = tileRect.bottom;
          this.velY = 0;
        } else if (
          playerRect.right > tileRect.left &&
          playerRect.left < tileRect.left
        ) {
          this.colliding = true;
          this.velX = 0;
          console.log("velocityX", this.velX);
          this.posX = this.posX - 5;
          this.animationFrame = 0;
        } else if (
          playerRect.left < tileRect.right &&
          playerRect.right > tileRect.right
        ) {
          this.colliding = true;
          this.posX = tileRect.right - 0.01;
        }
      }
    }

    for (let i = 0; i < this.edibleTiles.length; i++) {
      const tile = this.edibleTiles[i];
      if (tile.consumed) continue;

      const tileRect = {
        left: tile.x,
        right: tile.x + TILE_SIZE,
        top: tile.y,
        bottom: tile.y + TILE_SIZE,
      };
      this.isDoor = false;
      if (isColliding(playerRect, tileRect)) {
        console.log("collidedtileRect", tileRect);
        // TODO remove tile.consumed dont need extra conditoin
        // tile.consumed = true;
        this.score += tile.value;
        console.log("score", this.score);

        if (tile.type == "door") {
          tile.consumed = false;
          this.isDoor = true;
          break;
        } else {
          this.edibleTiles.splice(i, 1);
          i--;
        }
      }
    }
  }
}

// TODO change the type of the rectangle
function isColliding(rect1: any, rect2: any): boolean {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}
