import { harmingTiles } from "./constant";
import { SolidTile } from "./tiles/SolidTile";
import { EdibleTile } from "./tiles/edibleTIle";
import { HarmingTile } from "./tiles/harmingTiles";

interface GameEntityProps {
  posX: number;
  posY: number;
  width: number;
  height: number;
  solidTiles: SolidTile[];
  edibleTiles: EdibleTile[];
  harmingTiles: HarmingTile[];
}

export class GameEntity implements GameEntityProps {
  constructor({
    posX,
    posY,
    width,
    height,
    solidTiles,
    edibleTiles,
  }: GameEntityProps) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.solidTiles = solidTiles;
    this.edibleTiles = edibleTiles;
    this.harmingTiles = harmingTiles;
  }

  posX: number;
  posY: number;
  width: number;
  height: number;
  solidTiles: SolidTile[];
  edibleTiles: EdibleTile[];
  harmingTiles: HarmingTile[];
}
