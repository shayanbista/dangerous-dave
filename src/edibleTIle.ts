import { SolidTile } from "./SolidTile";
import { Tile } from "./tile";

export class EdibleTile extends Tile {
  private size: number;
  private sw: number;
  private sh: number;
  private sx: number;
  private sy: number;
  public static image: HTMLImageElement;
  public x: number;
  public y: number;
  consumed: boolean;
  value: number;

  constructor(
    i: number,
    j: number,
    x: number,
    y: number,
    type: string | "edible",
    sw?: number,
    sh?: number
  ) {
    super(type);
    this.size = 64;
    this.sw = sw || this.size;
    this.sh = sh || this.size;

    this.sx = i * this.size;
    this.sy = j * this.size;
    this.x = x;
    this.y = y;
    this.value = 0;
    this.consumed = false;

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

  scorevalue() {
    this.value = Tile.getScoreValue(this.type);
  }
}
