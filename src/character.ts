import { GameEntity } from "./gameEntity";
import { Tile } from "./tile";
import { solidTiles } from "./game";
import { SolidTile } from "./SolidTile";
import { TILE_SIZE } from "./constant";

interface InputKeys {
  right: { hold: boolean };
  left: { hold: boolean };
  up: { hold: boolean };
}

interface Grid {
  [key: number]: {
    [key: number]: SolidTile[];
  };
}

function getGridCellIndex(
  x: number,
  y: number
): { cellX: number; cellY: number } {
  return {
    cellX: Math.floor(x / TILE_SIZE),
    cellY: Math.floor(y / TILE_SIZE),
  };
}

function createSolidTileGrid(solidTiles: SolidTile[]): Grid {
  const grid: Grid = {};

  for (let tile of solidTiles) {
    const { cellX, cellY } = getGridCellIndex(
      tile.x * TILE_SIZE,
      tile.y * TILE_SIZE
    );

    if (!grid[cellX]) {
      grid[cellX] = {};
    }
    if (!grid[cellX][cellY]) {
      grid[cellX][cellY] = [];
    }

    grid[cellX][cellY].push(tile);
  }

  return grid;
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
  private readonly GRAVITY = 0.4;
  // private readonly MAX_FALL_SPEED = 10;
  private readonly JUMP_SPEED = -15;
  grounded: boolean = false;

  constructor(game: any, posX: number, posY: number) {
    super(game, posX, posY, Tile.size - 4, Tile.size);
    this.velX = 0;
    this.velY = 0;
    this.direction = 1;
    this.jumping = false;
    this.jumpTarget = 0;
    this.animationFrame = 0;
    this.gravity = 0.2;

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
        this.animationFrame = (this.animationFrame + 1) % 4;
      } else if (e.key === "ArrowLeft") {
        keys.left.hold = true;
        this.direction = -1;
        this.animationFrame = (this.animationFrame + 1) % 4;
      } else if (e.key === "ArrowUp") {
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

    // if (this.grounded == false) {

    // }
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
      this.velY += 0.04;
      this.canJump = false;
      this.grounded = false;
    }

    this.handleCollision();
  }

  handleCollision() {
    const playerRect = {
      left: this.posX + 10,
      right: this.posX + TILE_SIZE + 5,
      top: this.posY + 10,
      bottom: this.posY + TILE_SIZE - 5,
    };

    for (let tile of solidTiles) {
      const tileRect = {
        left: tile.x,
        right: tile.x + TILE_SIZE,
        top: tile.y,
        bottom: tile.y + TILE_SIZE,
      };

      if (isColliding(playerRect, tileRect)) {
        console.log("Collision detected:", tile);
        if (playerRect.bottom > tileRect.top && playerRect.top < tileRect.top) {
          this.posY = tileRect.top - TILE_SIZE;
          this.velY = 0;
          this.jumping = false;
          this.grounded = true;
          console.log("bottom collision");
        } else if (
          playerRect.top < tileRect.bottom &&
          playerRect.bottom > tileRect.bottom
        ) {
          console.log("collision at top");
          this.posY = tileRect.bottom;
          this.velY = 0;
          this.grounded = false;
        } else if (
          playerRect.right > tileRect.left &&
          playerRect.left < tileRect.left
        ) {
          console.log("collision at right");
          this.grounded = false;
          this.posX = tileRect.left - TILE_SIZE - 0.01;
        } else if (
          playerRect.left < tileRect.right &&
          playerRect.right > tileRect.right
        ) {
          this.grounded = false;
          this.posX = tileRect.right - 0.01;
        }
      }
    }
  }
}

function isColliding(rect1: any, rect2: any): boolean {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}
