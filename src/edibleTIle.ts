import { SolidTile } from "./SolidTile";

export class EdibleTile {
  private size: number;
  private sw: number;
  private sh: number;
  private sx: number;
  private sy: number;
  public static image: HTMLImageElement;
  public x: number;
  public y: number;

  constructor(
    i: number,
    j: number,
    x: number,
    y: number,
    sw?: number,
    sh?: number
  ) {
    this.size = 64;
    this.sw = sw || this.size;
    this.sh = sh || this.size;

    this.sx = i * this.size;
    this.sy = j * this.size;
    this.x = x;
    this.y = y;

    if (!EdibleTile.image) {
      EdibleTile.image = new Image();
      EdibleTile.image.src = "assets/sprites/tileset.png";
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dw: number = this.size,
    dh: number = this.size
  ) {
    ctx.drawImage(
      EdibleTile.image,
      this.sx,
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
