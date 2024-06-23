import { GameEntity } from "./GameEntity";
import { Tile } from "./tiles/tile";
import { TILE_SIZE, canvasHeight, canvasWidth, harmingTiles } from "./constant";
import { SolidTile } from "./tiles/SolidTile";
import { EdibleTile } from "./tiles/edibleTIle";
import { HarmingTile } from "./tiles/harmingTiles";

interface InputKeys {
  right: { hold: boolean };
  left: { hold: boolean };
  up: { hold: boolean };
}

interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface CharacterProps {
  posX: number;
  posY: number;
  solidTiles?: SolidTile[];
  edibleTiles?: EdibleTile[];
}

export class Character extends GameEntity {
  velX: number;
  velY: number;
  direction: number;
  jumping: boolean;
  canJump: boolean;
  jumpTarget: number;
  animationFrame: number;
  spriteImage: HTMLImageElement;
  keys: InputKeys;
  gravity: number;
  JUMP_SPEED = -10;
  grounded: boolean;
  colliding: boolean;
  moveAutomatically: boolean;
  score: number;
  isDoor: boolean;
  lives: number;
  reachedEndMap: boolean;
  controlsEnabled: boolean;
  utilityMessage: string;
  scoreMessage: string;
  levelUpMessage: string | null;
  frameCounter: number;
  framedelay: number;
  explosionComplete: boolean;
  explosionFrame: number;
  isDead: boolean;
  gameOver: boolean;
  collectedItem: { [key: string]: boolean };

  constructor({ posX, posY, solidTiles = [], edibleTiles = [] }: CharacterProps) {
    super({
      posX,
      posY,
      width: Tile.size - 4,
      height: Tile.size,
      solidTiles,
      edibleTiles,
      harmingTiles,
    });

    this.velX = 4;
    this.velY = 2;
    this.direction = 1;
    this.jumping = false;
    this.canJump = true;
    this.jumpTarget = 0;
    this.lives = 3;
    this.animationFrame = 0;
    this.gravity = 0.5;
    this.grounded = false;
    this.colliding = false;
    this.moveAutomatically = false;
    this.score = 0;
    this.isDoor = false;
    this.reachedEndMap = false;
    this.controlsEnabled = true;
    this.utilityMessage = "";
    this.scoreMessage = "";
    this.levelUpMessage = null;
    this.frameCounter = 0;
    this.framedelay = 7;
    this.explosionComplete = true;
    this.explosionFrame = 0;
    this.isDead = false;
    this.gameOver = false;
    this.posX = 150;
    this.posY = 100;
    this.collectedItem = { key: false };

    this.spriteImage = new Image();
    this.spriteImage.src = "assets/sprites/tileset.png";

    this.keys = {
      right: { hold: false },
      left: { hold: false },
      up: { hold: false },
    };

    this.initializeControls();
  }

  private initializeControls() {
    window.addEventListener("keydown", (e) => {
      if (this.controlsEnabled) this.handleKeyHold(e.key, true);
    });
    window.addEventListener("keyup", (e) => this.handleKeyHold(e.key, false));
  }

  private handleKeyHold(key: string, hold: boolean) {
    switch (key) {
      case "ArrowLeft":
        this.keys.left.hold = hold;
        break;
      case "ArrowRight":
        this.keys.right.hold = hold;
        break;
      case "ArrowUp":
        this.keys.up.hold = hold;
        break;
    }
  }

  draw(ctx: CanvasRenderingContext2D, viewX: number, viewY: number) {
    const spriteX = this.getSpriteX();
    console.log("spritex", spriteX);
    const scale = 1;
    const spriteY = this.explosionComplete ? 2 * Tile.size : 10 * Tile.size;

    ctx.drawImage(
      this.spriteImage,
      spriteX,
      spriteY,
      Tile.size,
      Tile.size,
      this.posX - viewX,
      this.posY - viewY,
      TILE_SIZE * scale,
      TILE_SIZE * scale
    );
  }

  private updateAnimationFrame() {
    if (this.keys.right.hold || this.keys.left.hold || this.moveAutomatically) {
      if (this.moveAutomatically) {
        console.log("move automatically is working");
        console.log("animation frame", this.animationFrame);
        console.log("framecounter", this.frameCounter);
      }
      this.frameCounter++;
      if (this.frameCounter >= this.framedelay) {
        this.animationFrame = (this.animationFrame + 1) % 3;
        this.frameCounter = 0;
      }
    } else {
      this.animationFrame = 0;
    }
  }

  private getSpriteX(): number {
    if (!this.explosionComplete) {
      const explosionFrameCount = 2;
      const explosionFrameOffset = 0;
      return ((this.explosionFrame % explosionFrameCount) + explosionFrameOffset) * Tile.size;
    } else {
      const defaultFrameCount = 3;
      const defaultFrameOffset = this.direction === 1 ? 1 : 5;
      return ((this.animationFrame % defaultFrameCount) + defaultFrameOffset) * Tile.size;
    }
  }

  moveCharacterAutomatically() {
    this.moveAutomatically = true;
    this.velX = 3;
    console.log("i am running");

    this.direction = 1;
    this.controlsEnabled = false;
    this.levelUpMessage = "More levels to go!";
  }

  hasReachedEnd() {
    this.reachedEndMap = true;
  }

  update() {
    this.applyGravity();
    this.updateAnimationFrame();
    if (this.moveAutomatically) this.handleAutomaticMovement();
    this.handleInputMovement();
    this.handleCollision();

    if (this.lives <= 0) {
      this.gameOver = true;
      setInterval(() => {
        document.getElementById("gameCanvas")!.style.display = "none";
        document.getElementById("splashScreen")!.style.display = "block";
      }, 4000);
    }
  }

  private applyGravity() {
    if (!this.grounded) {
      this.velY += this.gravity;
      this.canJump = false;
    }
  }

  private handleAutomaticMovement() {
    this.moveCharacterAutomatically();
    if (this.posX > 880) {
      this.animationFrame++;
      this.reachedEndMap = true;
      console.log("Character.ts: reachedEndMap =", this.reachedEndMap);
      this.posX = 0;
    }
  }

  private handleInputMovement() {
    this.posX += this.velX;
    this.posY += this.velY;
    this.velX = 0;

    if (this.keys.left.hold) {
      this.velX = -4;
      this.direction = -1;
    }

    if (this.keys.right.hold) {
      this.velX = 4;
      this.direction = 1;
    }

    if (this.keys.up.hold && this.grounded) {
      this.velY = this.JUMP_SPEED;
      this.grounded = false;
    }
  }

  handleCollision() {
    const keyExists = this.edibleTiles.some((tile) => tile.type === "Y");

    this.grounded = false;

    for (let tile of this.solidTiles) {
      this.handleSolidTileCollision(tile);
    }

    for (let i = 0; i < this.edibleTiles.length; i++) {
      const tile = this.edibleTiles[i];
      if (tile.consumed) continue;

      const tileRect = this.getTileRect(tile);
      this.isDoor = false;

      if (isColliding(this.playerRect, tileRect)) {
        this.handleEdibleTileCollision(tile, keyExists, i);
      }
    }
    for (let tile of this.harmingTiles) {
      this.handleHarmingTileCollision(tile);
    }
  }

  private handleSolidTileCollision(tile: SolidTile) {
    const tileRect = this.getTileRect(tile);

    const groundCheckRect = {
      left: this.posX + 5,
      right: this.posX + TILE_SIZE - 8,
      top: this.posY + TILE_SIZE - 5,
      bottom: this.posY + TILE_SIZE + 10,
    };

    this.grounded = isColliding(groundCheckRect, tileRect) ? true : this.grounded;

    if (isColliding(this.playerRect, tileRect)) {
      this.resolveTileCollision(tileRect);
    }
  }

  private resolveTileCollision(tileRect: Rect) {
    if (this.playerRect.bottom >= tileRect.top && this.playerRect.top <= tileRect.top) {
      this.posY = tileRect.top - TILE_SIZE;
      this.velY = 0;
      this.jumping = false;
      this.grounded = true;
    } else if (this.playerRect.top <= tileRect.bottom && this.playerRect.bottom >= tileRect.bottom) {
      this.posY = tileRect.bottom;
      this.velY = 0;
    } else if (this.playerRect.right >= tileRect.left && this.playerRect.left <= tileRect.left) {
      this.posX -= 5;
      this.animationFrame = 0;
    } else if (this.playerRect.left <= tileRect.right && this.playerRect.right >= tileRect.right) {
      this.posX = tileRect.right - 0.01;
    }
  }

  private handleEdibleTileCollision(tile: EdibleTile, crownExists: boolean, index: number) {
    this.score += tile.value;
    if (tile.type === "Y") {
      this.collectedItem.key = true;
      this.utilityMessage = "Go through the door";
      tile.consumed = true;
    }

    console.log("collectedItem", this.collectedItem);

    if (tile.type === "door") {
      if (this.collectedItem.key === true) {
        tile.consumed = false;
        this.isDoor = true;
        console.log("dave reached here");
        // this.collectedItem.key = false;
      } else {
        this.utilityMessage = "Take the key to go through the door";
      }
    } else {
      this.edibleTiles.splice(index, 1);
    }
  }

  private handleHarmingTileCollision(tile: HarmingTile) {
    const tileRect = this.getTileRect(tile);
    if (isColliding(this.playerRect, tileRect)) {
      if (this.lives > 0 && !this.isDead) {
        this.controlsEnabled = false;
        console.log("lives", this.lives);
        this.isDead = true;
        this.lives -= 1;

        this.handleExplosion();
      } else {
        console.log("Gameover");
      }
    }
  }

  private get playerRect() {
    return {
      left: this.posX + 10,
      right: this.posX + TILE_SIZE - 10,
      top: this.posY + 5,
      bottom: this.posY + TILE_SIZE - 5,
    };
  }

  private getTileRect(tile: { x: number; y: number }) {
    return {
      left: tile.x,
      right: tile.x + TILE_SIZE,
      top: tile.y,
      bottom: tile.y + TILE_SIZE,
    };
  }

  private respawn() {
    this.isDead = false;
    this.controlsEnabled = true;
    this.explosionComplete = true;
    this.posX = 100;
    this.posY = 100;

    this.jumping = false;
    this.grounded = false;
  }

  handleExplosion() {
    this.explosionComplete = false;
    this.explosionFrame = 0;
    this.frameCounter = 0;

    const totalDuration = 2000;
    const explosionFrameCount = 4;
    const intervalDuration = 150;

    const interval = setInterval(() => {
      if (this.frameCounter >= totalDuration / intervalDuration) {
        clearInterval(interval);
        this.explosionComplete = true;
        this.respawn();
      } else {
        this.explosionFrame = (this.explosionFrame + 1) % explosionFrameCount;
        this.frameCounter++;
      }
    }, intervalDuration);
  }
}

function isColliding(rect1: Rect, rect2: Rect): boolean {
  return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
}
