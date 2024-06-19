import { TILE_SIZE } from "./constant";
import { SolidTile } from "./SolidTile";
import { EdibleTile } from "./edibleTIle";

export class GameEntity {
  posX: number;
  posY: number;
  width: number;
  height: number;
  solidTiles: SolidTile[] = [];
  edibleTiles: EdibleTile[] = [];

  constructor(
    posX: number,
    posY: number,
    width: number,
    height: number,
    solidTiles: SolidTile[] = [],
    edibleTiles: EdibleTile[] = []
  ) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.solidTiles = solidTiles;
    this.edibleTiles = edibleTiles;
  }
}
