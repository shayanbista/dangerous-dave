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

export interface TileConfig {
  spriteX: number;
  spriteY: number;
  type: string;
}
export const gameState = { NOT_STARTED: true, RUNNING: false, ENDED: false, editorNotStarted: false };

export const tileConfig: { [key: string]: TileConfig } = {
  Bl: { spriteX: 0, spriteY: 5, type: "solid" },
  R: { spriteX: 1, spriteY: 0, type: "solid" },
  P: { spriteX: 2, spriteY: 0, type: "solid" },
  K: { spriteX: 3, spriteY: 0, type: "solid" },
  L: { spriteX: 4, spriteY: 0, type: "solid" },
  T: { spriteX: 5, spriteY: 0, type: "solid" },
  S: { spriteX: 4, spriteY: 8, type: "solid" },
  D: { spriteX: 0, spriteY: 1, type: "D" },
  Sp: { spriteX: 2, spriteY: 5, type: "Sp" },
  RD: { spriteX: 1, spriteY: 1, type: "RD" },
  G: { spriteX: 3, spriteY: 1, type: "Gun" },
  RNG: { spriteX: 4, spriteY: 1, type: "RNG" },
  Key: { spriteX: 5, spriteY: 1, type: "Key" },
  C: { spriteX: 6, spriteY: 1, type: "C" },
  J: { spriteX: 8, spriteY: 1, type: "jetpack" },
  Y: { spriteX: 7, spriteY: 1, type: "Y" },
  E: { spriteX: 1, spriteY: 8, type: "door" },
  F: { spriteX: 0, spriteY: 5, type: "Fire" },
  TE: { spriteX: 0, spriteY: 6, type: "Tentacles" },
  W: { spriteX: 0, spriteY: 7, type: "Water" },
  default: { spriteX: 0, spriteY: 0, type: "pickable" },
};
