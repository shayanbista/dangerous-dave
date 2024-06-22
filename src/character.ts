import { GameEntity } from "./gameEntity";
import { Tile } from "./tiles/tile";
import { TILE_SIZE, harmingTiles } from "./constant";
import { SolidTile } from "./tiles/SolidTile";
import { EdibleTile } from "./tiles/edibleTIle";
import { HarmingTile } from "./tiles/harmingTiles";

interface InputKeys {
  right: { hold: boolean };
  left: { hold: boolean };
  up: { hold: boolean };
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
  JUMP_SPEED = -15;
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

  constructor({
    posX,
    posY,
    solidTiles = [],
    edibleTiles = [],
  }: CharacterProps) {
    super({
      posX,
      posY,
      width: Tile.size - 4,
      height: Tile.size,
      solidTiles,
      edibleTiles,
      harmingTiles,
    });

    console.log("harmingTIles", harmingTiles);

    this.velX = 4;
    this.velY = 2;
    this.direction = 1;
    this.jumping = false;
    this.canJump = true;
    this.jumpTarget = 0;
    this.lives = 3;
    this.animationFrame = 0;
    this.gravity = 0.2;
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
    this.framedelay = 10;
    this.explosionComplete = true;
    this.explosionFrame = 0;

    this.spriteImage = new Image();
    this.spriteImage.src = "assets/sprites/tileset.png";

    this.keys = {
      right: { hold: false },
      left: { hold: false },
      up: { hold: false },
    };

    this.initializeControls(this.keys);
  }

  private initializeControls(keys: InputKeys) {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e, keys));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e, keys));
  }

  private handleKeyDown(e: KeyboardEvent, keys: InputKeys) {
    if (this.controlsEnabled) {
      if (e.key === "ArrowRight") {
        keys.right.hold = true;
        this.direction = 1;
      } else if (e.key === "ArrowLeft") {
        keys.left.hold = true;
        this.direction = -1;
      } else if (e.key === "ArrowUp") {
        this.velY -= 10;
        this.jumping = true;
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent, keys: InputKeys) {
    if (e.key === "ArrowRight") {
      keys.right.hold = false;
    } else if (e.key === "ArrowLeft") {
      keys.left.hold = false;
    } else if (e.key === "ArrowUp" && !this.jumping) {
      this.velY = this.JUMP_SPEED;
      this.jumping = true;
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    dw: number = Tile.size,
    dh: number = Tile.size,
    scale: number = 1
  ) {
    const spriteX = this.getSpriteX();
    console.log("spritex", spriteX);
    const spriteY = this.explosionComplete ? 2 * Tile.size : 10 * Tile.size;

    ctx.drawImage(
      this.spriteImage,
      spriteX,
      spriteY,
      Tile.size,
      Tile.size,
      this.posX,
      this.posY,
      dw * scale,
      dh * scale
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
      return (
        ((this.explosionFrame % explosionFrameCount) + explosionFrameOffset) *
        Tile.size
      );
    } else {
      const defaultFrameCount = 3;
      const defaultFrameOffset = this.direction === 1 ? 1 : 5;
      return (
        ((this.animationFrame % defaultFrameCount) + defaultFrameOffset) *
        Tile.size
      );
    }
  }

  moveCharacterAutomatically() {
    this.moveAutomatically = true;
    this.posX += this.velX;
    this.direction = 1;
    this.controlsEnabled = false;
    this.animationFrame++;

    this.updateAnimationFrame();
    this.levelUpMessage = "More levels to go!";
  }

  hasReachedEnd() {
    this.reachedEndMap = true;
    console.log("Reached end of map:", this.reachedEndMap);
    this.posX = 0;
  }

  update() {
    this.applyGravity();
    this.updateAnimationFrame();
    if (this.moveAutomatically) this.handleAutomaticMovement();
    this.handleInputMovement();
    this.handleCollision();
  }

  private applyGravity() {
    if (!this.grounded) {
      this.velY += 1;
      this.canJump = false;
    }
  }

  private handleAutomaticMovement() {
    this.moveCharacterAutomatically();
    if (this.posX > 900) {
      this.animationFrame++;
      this.reachedEndMap = true;
      console.log("Character.ts: reachedEndMap =", this.reachedEndMap);
      this.posX = 0;
    }
  }

  private handleInputMovement() {
    this.posY += this.velY;
    if (this.keys.right.hold || this.keys.left.hold) {
      this.frameCounter++;
      if (this.frameCounter >= this.framedelay) {
        this.animationFrame = (this.animationFrame + 1) % 3;
        this.frameCounter = 0;
      }
    } else {
      this.animationFrame = 0;
    }

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
  }

  handleCollision() {
    const playerRect = this.getPlayerRect();
    const crownExists = this.edibleTiles.some((tile) => tile.type === "Y");

    this.grounded = false;

    for (let tile of this.solidTiles) {
      this.handleSolidTileCollision(tile, playerRect);
    }

    for (let i = 0; i < this.edibleTiles.length; i++) {
      const tile = this.edibleTiles[i];
      if (tile.consumed) continue;

      const tileRect = this.getTileRect(tile);
      this.isDoor = false;

      if (isColliding(playerRect, tileRect)) {
        this.handleEdibleTileCollision(tile, crownExists, i);
      }
    }
    for (let tile of this.harmingTiles) {
      this.handleHarmingTileCollision(tile, playerRect);
    }
  }

  private handleSolidTileCollision(tile: SolidTile, playerRect: any) {
    const tileRect = this.getTileRect(tile);

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
      this.resolveTileCollision(playerRect, tileRect);
    }
  }

  // TODO resolve any
  private resolveTileCollision(playerRect: any, tileRect: any) {
    if (playerRect.bottom >= tileRect.top && playerRect.top <= tileRect.top) {
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
      this.posX -= 5;
      this.animationFrame = 0;
    } else if (
      playerRect.left <= tileRect.right &&
      playerRect.right >= tileRect.right
    ) {
      this.posX = tileRect.right - 0.01;
    }
  }

  private handleEdibleTileCollision(
    tile: EdibleTile,
    crownExists: boolean,
    index: number
  ) {
    this.score += tile.value;
    if (tile.type === "Y") {
      this.utilityMessage = "Go through the door";
      tile.consumed = true;
    }

    if (tile.type === "door") {
      if (!crownExists) {
        tile.consumed = false;
        this.isDoor = true;
      } else {
        this.utilityMessage = "Take the key to go through the door";
      }
    } else {
      this.edibleTiles.splice(index, 1);
    }
  }

  private handleHarmingTileCollision(tile: HarmingTile, playerRect: any) {
    const tileRect = this.getTileRect(tile);
    if (isColliding(playerRect, tileRect)) {
      this.lives -= 1;
      if (this.lives > 0) this.handleExplosion();
      else {
        console.log("Gameover");
      }
    }
  }

  private getPlayerRect() {
    return {
      left: this.posX + 10,
      right: this.posX + TILE_SIZE - 10,
      top: this.posY + 5,
      bottom: this.posY + TILE_SIZE - 5,
    };
  }

  private getTileRect(tile: any) {
    return {
      left: tile.x,
      right: tile.x + TILE_SIZE,
      top: tile.y,
      bottom: tile.y + TILE_SIZE,
    };
  }

  private respawn() {
    this.posX -= 50;
    this.controlsEnabled = true;
    this.explosionComplete = true;
    this.posX = 300;
    this.posY = 200;

    this.jumping = false;
    this.grounded = false;
  }

  handleExplosion() {
    this.explosionComplete = false;
    this.explosionFrame = 0;
    this.frameCounter = 0;
    this.controlsEnabled = false;
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

// Utility function to check collision
function isColliding(rect1: any, rect2: any): boolean {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}
