import { Enemy } from "./Classes/Enemy";
import { SolidTile } from "./Classes/tiles/SolidTile";
import { EdibleTile } from "./Classes/tiles/EdibleTile";
import { HarmingTile } from "./Classes/tiles/HarmingTiles";

export const TILE_SIZE = 50;
export const DRAW_SIZE = 50;
export const canvasWidth = 1000;
export const canvasHeight = 500;

export const solidTiles: SolidTile[] = [];
export const edibleTiles: EdibleTile[] = [];
export const harmingTiles: HarmingTile[] = [];
export const enemies: Enemy[] = [];

export const tiles = {
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

export const tileValues = {
  D: 50,
  RD: 100,
  PD: 150,
  G: 200,
  RNG: 300,
  Key: 500,
  C: 1000,
  Y: 2000,
  J: 3000,
  E: 4000,
};
