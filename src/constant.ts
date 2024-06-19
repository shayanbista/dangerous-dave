import { SolidTile } from "./SolidTile";
import { EdibleTile } from "./edibleTIle";

export const TILE_SIZE = 50;
export const DRAW_SIZE = 50;

export const solidTiles: SolidTile[] = [];
export const edibleTiles: EdibleTile[] = [];

export const TILES = {
  BlackTile: "B", // 0,0
  RedTile: "R", // 1,0
  PurpleTile: "P", // 2,0
  RockTile: "K", // 3,0
  LavaTile: "L", // 4,0
  BlueBlock: "T", // 5,0
  Diamond: "D", // 0,1
  RedDiamond: "RD", // 1,1
  PurpleDiamond: "PD", // 2,1
  Gun: "G", // 3,1
  Ring: "RNG", // 4,1
  Key: "K", // 5,1
  Crown: "C", // 6,1
  Trophy: "Y", // 7,1
  Jetpack: "J", // 8,1
  ExitDoor: "E", // 1,8
};
