
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

function getGridCellIndex(
  x: number,
  y: number
): { cellX: number; cellY: number } {
  return {
    cellX: Math.floor(x / TILE_SIZE),
    cellY: Math.floor(y / TILE_SIZE),
  };
}

export class Character extends GameEntity {
  velX: number;
  velY: number;
  direction: number;
  jumping: boolean;
  jumpTarget: number;
  animationFrame: number;
  spriteImage: HTMLImageElement;
  keys: InputKeys;

  constructor(game: any, posX: number, posY: number) {
    super(game, posX, posY, Tile.size - 4, Tile.size);
    this.velX = 0;
    this.velY = 0;
    this.direction = 1;
    this.jumping = false;
    this.jumpTarget = 0;
    this.animationFrame = 0;

    this.keys = {
      up: { hold: false },
      right: { hold: false },
      left: { hold: false },
    };

    this.spriteImage = new Image();
    this.spriteImage.src = "assets/sprites/tileset.png";

    this.initInput(this.keys);
  }

  initInput(keys: InputKeys) {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        keys.right.hold = true;
        this.direction = 1;
        this.animationFrame = (this.animationFrame + 1) % 4;
      } else if (e.key === "ArrowLeft") {
        keys.left.hold = true;
        this.direction = -1;
        this.animationFrame = (this.animationFrame + 1) % 4;
      } else if (e.key === "ArrowUp" && !this.jumping) {
        this.velY = -15;
        this.jumping = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight") {
        keys.right.hold = false;
      } else if (e.key === "ArrowLeft") {
        keys.left.hold = false;
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

    if (this.keys.right.hold) {
      this.posX += speed;
      this.direction = 1;
    }

    if (this.keys.left.hold) {
      this.posX -= speed;
      this.direction = -1;
    }

    if (this.jumping) {
      this.posY += this.velY;
    }

    this.handleCollision();
  }

  handleCollision() {
    const playerTilePosX = Math.floor(this.posX / TILE_SIZE);
    const playerTilePosY = Math.floor(this.posY / TILE_SIZE);

    for (let tile of solidTiles) {
      const tilePosX = Math.floor(tile.x / TILE_SIZE);
      const tilePosY = Math.floor(tile.y / TILE_SIZE);

      if (playerTilePosX === tilePosX && playerTilePosY === tilePosY) {
        this.velX = 0;
        this.velY = 0;
        console.log("collision detected");

        // Snap the player to the nearest tile position
        this.posX = tile.x;
        this.posY = tile.y;

        return;
      }
    }
  }
}
