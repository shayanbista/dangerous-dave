import { Tile } from "./Tile";

export class EdibleTile extends Tile {
  consumed: boolean;
  value: number;

  constructor(i: number, j: number, x: number, y: number, type: string | "edible", sw?: number, sh?: number) {
    super(x, y, type, i, j, sw, sh);
    this.value = 0;
    this.consumed = false;
  }

  scorevalue() {
    this.value = Tile.getScoreValue(this.type);
  }
}
