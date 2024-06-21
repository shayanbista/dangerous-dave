import { Character } from "./character";
import { TILE_SIZE } from "./constant";
import { SolidTile } from "./SolidTile";
import { solidTiles } from "./constant";
import { edibleTiles } from "./constant";
import { Score } from "./score";
import { EdibleTile } from "./edibleTIle";

class Game {
  private levels: any;
  private gameCanvas: HTMLCanvasElement;
  private gameCtx: CanvasRenderingContext2D;
  private dave: Character;
  public score: Score | undefined;
  private currentLevel: number;
  private map: string[][];
  isDoor: boolean;
  private scoreboardHeight: number = 50;

  constructor(levels: any) {
    this.gameCanvas = document.getElementById(
      "gameCanvas"
    ) as HTMLCanvasElement;
    this.gameCtx = this.gameCanvas.getContext("2d")!;
    this.gameCanvas.style.background = "black";
    this.gameCanvas.height += this.scoreboardHeight;
    this.currentLevel = 0;
    this.levels = levels;
    this.score = new Score(this.gameCtx);

    document.getElementById("editor")!.style.display = "none";
    document.getElementById("gameCanvas")!.style.display = "block";

    this.map = this.levels[this.currentLevel];
    console.log("map", this.map);
    this.isDoor = false;

    console.log("levels", this.levels);
    console.log("map", this.map[2]);
    this.dave = new Character(0, 0);
    this.initializeGame();
  }

  private initializeGame() {
    console.log("game initialized");
    this.initializeTiles(this.map);
    this.setCharacterPosition();
    this.renderGame();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  private scoreSection() {
    this.gameCtx.fillStyle = "black";
    this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.scoreboardHeight);
    this.gameCtx.fillStyle = "white";
    this.gameCtx.font = "bold 24px Arial";
    this.gameCtx.fillText(`Score: ${this.dave.score}`, 10, 30);
  }

  private footerSection() {
    this.gameCtx.fillStyle = "gray";
    this.gameCtx.fillRect(
      0,
      this.gameCanvas.height - this.scoreboardHeight,
      this.gameCanvas.width,
      this.scoreboardHeight
    );
  }

  private setCharacterPosition() {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === "DA") {
          this.dave = new Character(
            x * TILE_SIZE,
            y * TILE_SIZE + this.scoreboardHeight,
            solidTiles,
            edibleTiles
          );
          return;
        }
      }
    }
  }

  private initializeTiles(map: string[][]) {
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
              type = "D";
              break;
            case "RD":
              [spriteX, spriteY] = [1, 1];
              type = "RD";
              break;
            case "G":
              [spriteX, spriteY] = [3, 1];
              type = "G";
              break;
            case "RNG":
              [spriteX, spriteY] = [4, 1];
              type = "RNG";
              break;
            case "Key":
              [spriteX, spriteY] = [5, 1];
              type = "Key";
              break;
            case "C":
              [spriteX, spriteY] = [6, 1];
              type = "C";
              break;
            case "Y":
              [spriteX, spriteY] = [7, 1];
              type = "Y";
              break;
            case "J":
              [spriteX, spriteY] = [8, 1];
              type = "J";
              break;
            case "E":
              [spriteX, spriteY] = [1, 8];
              type = "door";
              break;
            default:
              [spriteX, spriteY] = [0, 0];
              type = "pickable";
              break;
          }

          if (type === "solid") {
            let tile1 = new SolidTile(
              spriteX,
              spriteY,
              x * TILE_SIZE,
              y * TILE_SIZE + this.scoreboardHeight,
              64,
              64
            );
            solidTiles.push(tile1);
          } else {
            let tile2 = new EdibleTile(
              spriteX,
              spriteY,
              x * TILE_SIZE,
              y * TILE_SIZE + this.scoreboardHeight,
              type,
              64,
              64
            );
            tile2.scorevalue();
            edibleTiles.push(tile2);
          }
        }
      }
    }
  }

  private isInDoor() {
    if (this.dave.isDoor) {
      if (this.currentLevel < this.levels.length - 1) {
        this.currentLevel++;
        this.loadlevel();
        setTimeout(() => {
          this.isDoor = false;
        }, 100);
      } else {
        console.log("all levels completed");
      }
    }
  }

  private loadlevel() {
    this.map = this.levels[this.currentLevel];
    console.log("New map", this.map);
    this.initializeTiles(this.map);
    this.setCharacterPosition();
    this.dave.isDoor = false;

    this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    this.renderGame();
  }

  private renderTiles() {
    for (const tile of solidTiles) {
      tile.draw(this.gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
    }
    for (const tile of edibleTiles) {
      if (!tile.consumed) {
        tile.draw(this.gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  private renderGame() {
    this.renderTiles();
    this.renderDave(this.dave.posX, this.dave.posY);
  }

  private renderDave(posX: number, posY: number) {
    this.dave.draw(this.gameCtx, posX, posY, TILE_SIZE, TILE_SIZE);
  }

  private gameLoop() {
    this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    console.log("current level", this.currentLevel);
    this.isInDoor();
    this.scoreSection();
    this.footerSection();
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
