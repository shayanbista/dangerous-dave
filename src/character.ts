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
  moveAutomatically: boolean;
  score: number;
  isDoor: boolean;
  reachedEndMap: boolean;
  controlsEnabled: boolean;
  utilityMessage: string;
  scoreMessage: string;
  levelUpMessage: string | null;
  frameCounter: number;
  framedelay: number;

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
    this.levelUpMessage = null;
    this.velX = 3.5;
    this.velY = 2;
    this.direction = 1;
    this.jumping = false;
    this.jumpTarget = 0;
    this.animationFrame = 0;
    this.gravity = 0.2;
    this.colliding = false;
    this.score = 0;
    this.isDoor = false;
    this.moveAutomatically = false;
    this.reachedEndMap = false;
    this.controlsEnabled = true;
    this.frameCounter = 0;
    this.framedelay = 10;
    this.utilityMessage = "";
    this.scoreMessage = "";

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
      if (this.controlsEnabled) {
        if (e.key === "ArrowRight") {
          keys.right.hold = true;
          this.direction = 1;
          if (!this.jumping)
            this.animationFrame = (this.animationFrame + 1) % 4;
        } else if (e.key === "ArrowLeft") {
          keys.left.hold = true;
          this.direction = -1;
          if (!this.jumping)
            this.animationFrame = (this.animationFrame + 1) % 4;
        } else if (e.key === "ArrowUp") {
          this.velY -= 10;
          this.jumping = true;
        }
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

    ctx.fillStyle = "rgba(0,255,0,0.5)";
    ctx.fillRect(this.posX, this.posY + 5, TILE_SIZE - 8, TILE_SIZE - 5);

    ctx.drawImage(
      this.spriteImage,
      spriteX,
      spriteY,
      spriteWidth,
      spriteHeight,
      this.posX,
      this.posY,
      dw,
      dh
    );
  }

  moveCharacterAutomatically() {
    this.posX += this.velX;
    this.direction = 1;
    this.controlsEnabled = false;
    this.moveAutomatically = true;
    this.levelUpMessage = "more levels to go !!!";
  }
  hasReachedEnd() {
    this.reachedEndMap = true;
    console.log("reahedend map", this.reachedEndMap);
    this.posX = 0;
  }

  update() {
    if (this.grounded == false) {
      this.velY += 1;
      this.canJump = false;
    }

    if (this.moveAutomatically) {
      this.moveCharacterAutomatically();
      if (this.posX > 900) {
        this.reachedEndMap = true;
        console.log("Character.ts: reachedEndMap =", this.reachedEndMap);
        this.posX = 0;
      }
    }

    this.posY += this.velY;

    if (this.keys.left.hold) {
      this.posX -= this.velX;
      this.direction = -1;
    }

    if (this.keys.right.hold) {
      this.posX += this.velX;
      this.direction = 1;
    }

    if (this.jumping) {
      this.posY += this.velY;
      this.canJump = false;
      this.grounded = false;
    }

    this.handleCollision();
  }

  getReachedEndMap(): boolean {
    return this.reachedEndMap ?? false;
  }

  handleCollision() {
    const playerRect = {
      left: this.posX + 10,
      right: this.posX + TILE_SIZE - 10,
      top: this.posY + 5,
      bottom: this.posY + TILE_SIZE - 5,
    };

    const crownExists = this.edibleTiles.some((tile) => tile.type === "Y");

    this.grounded = false;

    for (let tile of this.solidTiles) {
      const tileRect = {
        left: tile.x,
        right: tile.x + TILE_SIZE,
        top: tile.y,
        bottom: tile.y + TILE_SIZE,
      };

      const groundCheckRect = {
        left: this.posX + 5,
        right: this.posX + TILE_SIZE - 8,
        top: this.posY + TILE_SIZE - 5,
        bottom: this.posY + TILE_SIZE + 10,
      };

      this.grounded = isColliding(groundCheckRect, tileRect)
        ? true
        : this.grounded;
      if (isColliding(playerRect, tileRect)) {
        if (
          playerRect.bottom >= tileRect.top &&
          playerRect.top <= tileRect.top
        ) {
          this.posY = tileRect.top - TILE_SIZE;
          this.velY = 0;
          this.jumping = false;
        } else if (
          playerRect.top <= tileRect.bottom &&
          playerRect.bottom >= tileRect.bottom
        ) {
          this.posY = tileRect.bottom;
          this.velY = 0;
        } else if (
          playerRect.right >= tileRect.left &&
          playerRect.left <= tileRect.left
        ) {
          this.colliding = true;
          this.posX = this.posX - 5;
          this.animationFrame = 0;
        } else if (
          playerRect.left <= tileRect.right &&
          playerRect.right >= tileRect.right
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
        this.score += tile.value;
        if (tile.type == "Y") {
          this.utilityMessage = "go thru the door";
          console.log("key is taken");
          tile.consumed = true;
        }

        if (tile.type == "door") {
          if (!crownExists) {
            tile.consumed = false;
            this.isDoor = true;
            break;
          } else {
            this.utilityMessage = "take the key to go through the door";
          }
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
