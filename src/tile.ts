export class Tile {
  static size = 64;
  static types = {
    solid: ["B", "R", "P", "K", "L", "T"],
    // solid: ["R", "P", "K", "L", "T"],
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
  Jetpack: "J", // 8,1
  ExitDoor: "E", // 1,8
};
