import { Character } from "./character";

import { EdibleTile } from "./edibleTIle";
import { TILE_SIZE } from "./constant";
import { SolidTile } from "./SolidTile";
import { solidTiles } from "./constant";
import { edibleTiles } from "./constant";

class Game {
  private gameCanvas: HTMLCanvasElement;
  private gameCtx: CanvasRenderingContext2D;

  private map: (string | null)[][];
  private dave: Character;

  constructor(map: (string | null)[][]) {
    this.gameCanvas = document.getElementById(
      "gameCanvas"
    ) as HTMLCanvasElement;
    this.gameCtx = this.gameCanvas.getContext("2d")!;
    this.map = map;
    this.dave = new Character(0, 0);
    this.initializeGame();
  }

  private initializeGame() {
    this.gameCanvas = document.getElementById(
      "gameCanvas"
    ) as HTMLCanvasElement;
    this.gameCtx = this.gameCanvas.getContext("2d")!;
    this.gameCanvas.style.backgroundColor = "black";

    this.initializeTiles(this.map);

    // Find Dave's starting position
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === "DA") {
          this.dave = new Character(
            x * TILE_SIZE,
            y * TILE_SIZE,
            solidTiles,
            edibleTiles
          );
          break;
        }
      }
    }

    this.renderGame();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  private initializeTiles(map: (string | null)[][]) {
    // Clear previous tiles
    solidTiles.length = 0;
    edibleTiles.length = 0;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] && map[y][x] !== "DA") {
          const tile = map[y][x]!;
          let spriteX: number, spriteY: number;
          let type: string;

          switch (tile) {
            case "B":
              [spriteX, spriteY] = [0, 0];
              type = "solid";
              break;
            case "R":
              [spriteX, spriteY] = [1, 0];
              type = "solid";
              break;
            case "P":
              [spriteX, spriteY] = [2, 0];
              type = "solid";
              break;
            case "K":
              [spriteX, spriteY] = [3, 0];
              type = "solid";
              break;
            case "L":
              [spriteX, spriteY] = [4, 0];
              type = "solid";
              break;
            case "T":
              [spriteX, spriteY] = [5, 0];
              type = "solid";
              break;
            case "D":
              [spriteX, spriteY] = [0, 1];
              type = "pickable";
              break;
            case "RD":
              [spriteX, spriteY] = [1, 1];
              type = "pickable";
              break;
            case "G":
              [spriteX, spriteY] = [3, 1];
              type = "pickable";
              break;
            case "RNG":
              [spriteX, spriteY] = [4, 1];
              type = "pickable";
              break;
            case "Key":
              [spriteX, spriteY] = [5, 1];
              type = "pickable";
              break;
            case "C":
              [spriteX, spriteY] = [6, 1];
              type = "pickable";
              break;
            case "Y":
              [spriteX, spriteY] = [7, 1];
              type = "pickable";
              break;
            case "J":
              [spriteX, spriteY] = [8, 1];
              type = "pickable";
              break;
            case "E":
              [spriteX, spriteY] = [1, 8];
              type = "pickable";
              break;
            default:
              [spriteX, spriteY] = [0, 0];
              type = "pickable";
              break;
          }

          const sprite =
            type === "solid"
              ? new SolidTile(
                  spriteX,
                  spriteY,
                  x * TILE_SIZE,
                  y * TILE_SIZE,
                  64,
                  64
                )
              : new EdibleTile(
                  spriteX,
                  spriteY,
                  x * TILE_SIZE,
                  y * TILE_SIZE,
                  64,
                  64
                );

          if (type === "solid") {
            solidTiles.push(sprite as SolidTile);
          }

          if (type === "pickable") {
            edibleTiles.push(sprite as EdibleTile);
          }
        }
      }
    }
  }

  private renderTiles() {
    for (const tile of solidTiles) {
      tile.draw(this.gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
    }
    for (const tile of edibleTiles) {
      if (!tile.consumed)
        tile.draw(this.gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
    }
  }

  private renderGame() {
    this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    this.renderTiles();
    this.renderDave(this.dave.posX, this.dave.posY);
  }

  private renderDave(posX: number, posY: number) {
    let spriteX = 2;
    let spriteY = 2;

    if (this.dave.direction === 1) {
      spriteX = (this.dave.animationFrame % 4) + 1;
    } else {
      spriteX = (this.dave.animationFrame % 4) + 5;
    }

    this.dave.draw(this.gameCtx, posX, posY, TILE_SIZE, TILE_SIZE);
  }

  private gameLoop() {
    this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    this.dave.update();
    this.renderGame();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  private getTile(x: number, y: number) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    return this.map[row] && this.map[row][col];
  }
}

export { Game };
