import { TILE_SIZE, edibleTiles, harmingTiles, solidTiles } from "../constant";
import { Bullet } from "./Bullet";
import { GameEntity } from "./GameEntity";
import { SolidTile } from "./tiles/SolidTile";
import { EdibleTile } from "./tiles/EdibleTile";
import { HarmingTile } from "./tiles/HarmingTiles";
import { Tile } from "./tiles/Tile";

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

  readonly horizontalHitBoxOffset = 5;
  readonly verticalHitBoxOffset = 5;
  isShooting: boolean;
  canshoot: boolean;
  lastShotTime: number;
  shootCooldown: number;
  bullets: Bullet[];

  private jetpackActive: boolean;
  private jetpackThrust: number;
  private jetpackFuel: number;
  initalposX: number;
  initalposY: number;

  constructor({ posX, posY }: CharacterProps) {
    super({
      posX,
      posY,
      width: Tile.size - 4,
      height: Tile.size,
    });

    this.velX = 0;
    this.velY = 0;
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
    this.collectedItem = { key: false, door: false, gun: false, jetpack: false };
    this.isShooting = true;
    this.canshoot = true;
    this.jetpackActive = false;
    this.jetpackThrust = 0.5;
    this.jetpackFuel = 100;
    this.initalposX = posX;
    this.initalposY = posY;

    this.bullets = [];
    this.lastShotTime = 0;
    this.shootCooldown = 3000;

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
      case "l":
        this.shoot();
        break;
      case "x":
        if (hold) this.activateJetpack();
        else this.deactivateJetpack();
        break;
    }
  }

  private shoot() {
    if (this.collectedItem.gun === true) {
      const currentTime = Date.now();
      if (currentTime - this.lastShotTime >= this.shootCooldown) {
        const bullet = new Bullet(this.posX, this.posY, this, 5, this.direction);
        console.log("bullet", bullet);

        bullet.isActive = true;
        this.bullets.push(bullet);
        this.lastShotTime = currentTime;
        this.isShooting = true;
      }
    } else {
      this.utilityMessage = "no gun to fire bullet";
    }
  }

  draw(ctx: CanvasRenderingContext2D, viewX: number, viewY: number) {
    if (this.jetpackActive) {
      let spriteX = this.direction == 1 ? 6 : 5;
      let spriteY = 4 * 64;
      ctx.drawImage(
        this.spriteImage,
        spriteX * 64,
        spriteY,
        Tile.size,
        Tile.size,
        this.posX - viewX,
        this.posY - viewY,
        TILE_SIZE * 1,
        TILE_SIZE * 1
      );
    } else {
      const spriteX = this.getSpriteX();
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
  }

  private updateAnimationFrame() {
    if (this.keys.right.hold || this.keys.left.hold || this.moveAutomatically) {
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

    this.direction = 1;
    this.controlsEnabled = false;
    this.levelUpMessage = "More levels to go!";
  }

  hasReachedEnd() {
    this.reachedEndMap = true;
  }

  activateJetpack() {
    if (this.collectedItem.jetpack && this.jetpackFuel > 0) {
      this.jetpackActive = true;
      this.utilityMessage = "jetpack activated";
    }
  }

  deactivateJetpack() {
    this.jetpackActive = false;
  }

  update() {
    this.applyGravity();
    this.updateAnimationFrame();
    if (this.moveAutomatically) this.handleAutomaticMovement();
    this.handleInputMovement();
    this.handleCollision();

    if (this.lives <= 0) {
      this.gameOver = true;
    }

    if (this.jetpackActive && this.jetpackFuel > 0) {
      this.velY -= this.jetpackThrust;

      this.jetpackFuel -= 0.2;
    }
    if (this.jetpackFuel <= 0) {
      this.deactivateJetpack();
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
    this.grounded = false;
    this.colliding = false;

    for (let tile of solidTiles) {
      this.handleSolidTileCollision(tile);
    }

    for (let i = 0; i < edibleTiles.length; i++) {
      const tile = edibleTiles[i];
      if (tile.consumed) continue;

      const tileRect = this.getTileRect(tile);
      this.isDoor = false;

      if (isColliding(this.playerRect, tileRect)) {
        this.handleEdibleTileCollision(tile, i);
      }
    }
    for (let tile of harmingTiles) {
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

    const newPlayerRect = {
      ...this.playerRect,
      left: this.playerRect.left + this.velX,
      right: this.playerRect.right + this.velX,
    };

    if (isColliding(newPlayerRect, tileRect)) {
      this.resolveTileCollision(tileRect);
    }
  }

  private resolveTileCollision(tileRect: Rect) {
    const overlapX = Math.min(this.playerRect.right - tileRect.left, tileRect.right - this.playerRect.left);
    const overlapY = Math.min(this.playerRect.bottom - tileRect.top, tileRect.bottom - this.playerRect.top);

    if (overlapX < overlapY) {
      if (
        this.velX < 0 &&
        this.playerRect.left + this.velX < tileRect.right &&
        this.playerRect.right > tileRect.right
      ) {
        this.posX = tileRect.right - this.horizontalHitBoxOffset;
        this.velX = 0;
      } else if (
        this.velX > 0 &&
        this.playerRect.right + this.velX > tileRect.left &&
        this.playerRect.left < tileRect.left
      ) {
        this.posX = tileRect.left + this.horizontalHitBoxOffset - TILE_SIZE;
        this.velX = 0;
      }
    } else {
      if (this.velY < 0 && this.playerRect.top < tileRect.bottom && this.playerRect.bottom > tileRect.bottom) {
        this.posY = tileRect.bottom;
        this.velY = 0;
      } else if (this.velY > 0 && this.playerRect.bottom > tileRect.top && this.playerRect.top < tileRect.top) {
        this.posY = tileRect.top - TILE_SIZE;
        this.velY = 0;
        this.jumping = false;
        this.grounded = true;
      }
    }
  }

  private handleEdibleTileCollision(tile: EdibleTile, index: number) {
    this.score += tile.value;
    if (tile.type === "Y") {
      this.collectedItem.key = true;
      this.utilityMessage = "Go through the door";
      tile.consumed = true;
    }

    if (tile.type === "door") {
      if (this.collectedItem.key === true) {
        tile.consumed = false;
        this.isDoor = true;
        this.collectedItem.door = true;
      } else {
        this.utilityMessage = "Take the key to go through the door";
      }
    } else {
      edibleTiles.splice(index, 1);
    }

    if (tile.type === "Gun") {
      this.collectedItem.gun = true;

      this.utilityMessage = "gun picked (l)";
    }

    if (tile.type === "jetpack") {
      this.collectedItem.jetpack = true;
    }
  }

  loselife() {
    this.controlsEnabled = false;
    this.isDead = true;
    this.lives -= 1;
    this.handleExplosion();
    // this.invisible=true;
  }

  private handleHarmingTileCollision(tile: HarmingTile) {
    const tileRect = this.getTileRect(tile);
    if (isColliding(this.playerRect, tileRect)) {
      if (this.lives > 0 && !this.isDead) {
        this.loselife();
      } else {
        console.log("Gameover");
      }
    }
  }

  private get playerRect() {
    return {
      left: this.posX + this.horizontalHitBoxOffset,
      right: this.posX + TILE_SIZE - this.horizontalHitBoxOffset,
      top: this.posY + this.verticalHitBoxOffset,
      bottom: this.posY + TILE_SIZE - this.verticalHitBoxOffset,
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
    this.posX = this.initalposX;
    this.posY = this.initalposY;

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
