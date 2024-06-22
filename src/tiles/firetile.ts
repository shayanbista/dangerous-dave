import { HarmingTile } from "./harmingTiles";

export class FireTile extends HarmingTile {
  constructor(
    spriteX: number,
    spriteY: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(spriteX, spriteY, x, y, "fire", width, height);
  }

}
