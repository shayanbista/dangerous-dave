import { Tile } from "./Tile";

export class SolidTile extends Tile {
  static solidTiles: SolidTile[] = [];

  constructor(i: number, j: number, x: number, y: number, sw?: number, sh?: number) {
    super(x, y, "solid", i, j, sw, sh);
  }
}
