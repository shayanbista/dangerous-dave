import { Tile } from "./tile";

export class HarmingTile extends Tile {
  private size: number;
  private sw: number;
  private sh: number;
  private sx: number;
  private sy: number;
  public static image: HTMLImageElement;
  public x: number;
  public y: number;
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
    super(x, y, type);
    this.size = 64;
    this.sw = sw || this.size;
    this.sh = sh || this.size;

    this.sx = i * this.size;
    this.sy = j * this.size;
    this.x = x;
    this.y = y;
    this.consumed = false;

    this.frameIndex = 0;
    this.frameCount = frameCount;
    this.frameDelay = frameDelay;
    this.frameCounter = 0;

    if (!HarmingTile.image) {
      HarmingTile.image = new Image();
      HarmingTile.image.src = "assets/sprites/tileset.png";
    }
  }

  updateAnimationFrame() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.frameCounter = 0;
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dw: number = this.size,
    dh: number = this.size
  ) {
    this.updateAnimationFrame();
    const spriteX = this.sx + this.frameIndex * this.size;
    ctx.drawImage(
      HarmingTile.image,
      spriteX,
      this.sy,
      this.sw,
      this.sh,
      x,
      y,
      dw,
      dh
    );
  }
}
