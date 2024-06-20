import { SolidTile } from "./SolidTile";
import { EdibleTile } from "./edibleTIle";

interface GameEntityProps {
  posX: number;
  posY: number;
  width: number;
  height: number;
  solidTiles: SolidTile[];
  edibleTiles: EdibleTile[];
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
  }
  posX: number;
  posY: number;
  width: number;
  height: number;
  solidTiles: SolidTile[];
  edibleTiles: EdibleTile[];
}
