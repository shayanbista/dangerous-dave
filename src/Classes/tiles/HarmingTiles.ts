import { Tile } from "./Tile";

export class HarmingTile extends Tile {
  consumed: boolean;
  frameIndex: number;
  frameCount: number;
  frameDelay: number;
  frameCounter: number;

  constructor(
    i: number,
    j: number,
    x: number,
    y: number,
    type: string | "harming",
    sw?: number,
    sh?: number,
    frameCount: number = 1,
    frameDelay: number = 10
  ) {
    super(x, y, type, i, j, sw, sh);
    this.consumed = false;
    this.frameIndex = 0;
    this.frameCount = frameCount;
    this.frameDelay = frameDelay;
    this.frameCounter = 0;
  }

  updateAnimationFrame() {
    this.frameCounter++;

    if (this.frameCounter >= this.frameDelay) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.frameCounter = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, dw: number = this.size, dh: number = this.size) {
    this.updateAnimationFrame();
    const spriteX = this.sx + this.frameIndex * this.size;
    ctx.drawImage(Tile.image, spriteX, this.sy, this.sw, this.sh, x, y, dw, dh);
  }
}
