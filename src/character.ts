import { GameEntity } from "./gameEntity";
import { Tile } from "./tile";

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

    // Load character sprite
    this.spriteImage = new Image();
    this.spriteImage.src = "assets/sprites/tileset.png";

    // Initialize input handling
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
        this.velY = -15; // Jump velocity
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
    // Gravity
    // this.velY += 1;
    // this.posY += this.velY;

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
      console.log("Dave is jumping");
      this.posY += this.velY;
    }

    // this.handleCollision();
  }

  // Uncomment and implement collision handling as needed
  // handleCollision() {
  //   if (this.isClipping("left")) {
  //     this.posX += Tile.size - this.width / 2;
  //   } else if (this.isClipping("right")) {
  //     this.posX -= Tile.size - this.width / 2;
  //   }
  //   if (this.isClipping("up")) {
  //     this.velY = 0;
  //     this.jumping = false;
  //   }
  //   if (this.isClipping("down")) {
  //     this.velY = 0;
  //   }
  // }
}
