interface ITileConfig {
  i: number;
  j: number;
  x: number;
  y: number;
  type: string;
  sw?: number;
  sh?: number;
}

export class Tile implements ITileConfig {
  type: string;
  x: number;
  y: number;
  size: number;
  sw: number;
  sh: number;
  sx: number;
  sy: number;
  i: number = 0;
  j: number = 0;

  static image: HTMLImageElement;

  constructor(x: number, y: number, type: string, i: number, j: number, sw?: number, sh?: number) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 64;
    this.sw = sw || this.size;
    this.sh = sh || this.size;
    this.sx = i * this.size;
    this.sy = j * this.size;

    if (!Tile.image) {
      Tile.image = new Image();
      Tile.image.src = "assets/sprites/tileset.png";
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, dw: number = this.size, dh: number = this.size) {
    ctx.drawImage(Tile.image, this.sx, this.sy, this.sw, this.sh, x, y, dw, dh);
  }

  static size = 64;
  static types = {
    solid: ["B", "R", "P", "K", "L", "T"],
    pickable: ["D", "RD", "PD", "G", "RNG", "Key", "C", "Y", "J", "E"],
    lethal: ["F", "S"],
  };

  static scoreValues: { [key: string]: number } = {
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

  static isSolid(tile: string): boolean {
    return this.types.solid.includes(tile);
  }

  static isPickable(tile: string): boolean {
    return this.types.pickable.includes(tile);
  }

  static isLethal(tile: string): boolean {
    return this.types.lethal.includes(tile);
  }

  static getScoreValue(tile: string): number {
    return this.scoreValues[tile] || 0;
  }
}

export const TILES = {
  BlackTile: "B", // 0,0
  RedTile: "R", // 1,0
  PurpleTile: "P", // 2,0
  RockTile: "K", // 3,0
  LavaTile: "L", // 4,0
  BlueBlock: "T", // 5,0
  Diamond: "D", // 0,1
  RedDiamond: "RD", // 1,1
  Dave: "DA", // 0,2
  Gun: "G", // 3,1
  Ring: "RNG", // 4,1
  Key: "Key", // 5,1
  Crown: "C", // 6,1
  Trophy: "Y", // 7,1
  Jetpack: "J", // 1,8
  Steel: "S",
  Spider: "Sp", // 2,10
  ExitDoor: "E", // 1,8
};
