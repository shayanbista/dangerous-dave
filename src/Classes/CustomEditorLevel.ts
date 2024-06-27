import { SolidTile } from "./tiles/SolidTile";
import { CustomMap1, level1Map, level2Map } from "../levels";
import { Game } from "./Game/GameEngine";
import { tileProperties } from "./tiles/tileProperties";
import { Tile } from "./tiles/Tile";
import { TILE_SIZE } from "../constant";

const TILE_DRAW_SIZE = TILE_SIZE;

export class MapEditor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileSelect: HTMLElement;
  private saveBtn: HTMLButtonElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private output: HTMLTextAreaElement;
  private errorMsg: HTMLElement;
  private successMsg: HTMLElement;
  private selectedTile: string;
  private map: string[][];
  private tilesetImg: HTMLImageElement;
  private levels: string[][][];
  private levelIndex: number;

  constructor() {
    this.canvas = document.getElementById("map") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.tileSelect = document.getElementById("tileSelector") as HTMLElement;
    this.canvas.style.background = "red";
    this.saveBtn = document.getElementById("save") as HTMLButtonElement;
    this.prevBtn = document.getElementById("previous-level") as HTMLButtonElement;
    this.nextBtn = document.getElementById("next-level") as HTMLButtonElement;

    this.output = document.createElement("textarea");
    this.errorMsg = document.getElementById("errorDisplay")!;
    this.successMsg = document.getElementById("successDisplay")!;
    this.selectedTile = "B";
    this.levels = [CustomMap1, level1Map, level2Map];
    this.levelIndex = 0;
    this.map = this.levels[this.levelIndex];

    this.tilesetImg = new Image();
    this.tilesetImg.src = "assets/sprites/tileset.png";

    this.initialize();
  }

  private initialize() {
    this.errorMsg.style.color = "red";
    this.successMsg.style.color = "green";

    this.tilesetImg.onload = () => {
      this.drawTileSelector();
      this.drawMap();
    };

    this.tilesetImg.onerror = () => {
      console.error("Failed to load tileset image");
    };

    this.canvas.addEventListener("click", this.addTile.bind(this));
    this.canvas.addEventListener("contextmenu", this.removeTile.bind(this));

    this.prevBtn.addEventListener("click", this.prevLevel.bind(this));
    this.nextBtn.addEventListener("click", this.nextLevel.bind(this));
    this.saveBtn.addEventListener("click", this.saveMap.bind(this));
  }

  // editor screen tiles
  private drawTileSelector() {
    this.tileSelect.innerHTML = "";
    const TILES: { [key: string]: string } = {
      BlueBlock: "T",
      RedTile: "R",
      PurpleTile: "P",
      RockTile: "K",
      Gun: "G",
      Steel: "S",
      Diamond: "D",
      RedDiamond: "RD",
      Dave: "DA",
      Fire: "F",
      Tentacles: "TE",
      Key: "Key",
      Water: "W",
      Trophy: "Y",
      Sp: "Sp",
      Jetpack: "J",
      ExitDoor: "E",
    };

    Object.keys(TILES).forEach((key, index) => {
      const tileBox = document.createElement("div");
      tileBox.classList.add("tile-box");
      tileBox.dataset.tile = TILES[key];
      if (TILES[key] === this.selectedTile) {
        tileBox.classList.add("selected");
      }

      const [spriteX, spriteY] = this.getTileCoordinates(TILES[key]);
      const sprite = new SolidTile(spriteX, spriteY, index, 0, Tile.size, Tile.size);
      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = Tile.size;
      tileCanvas.height = Tile.size;
      const ctx = tileCanvas.getContext("2d")!;
      sprite.draw(ctx, 0, 0, Tile.size, Tile.size);

      tileBox.appendChild(tileCanvas);
      this.tileSelect.appendChild(tileBox);

      tileBox.addEventListener("click", () => {
        this.selectedTile = tileBox.dataset.tile!;
        document.querySelectorAll(".tile-box").forEach((box) => box.classList.remove("selected"));
        tileBox.classList.add("selected");
      });
    });
  }
  // tile sprite values
  private getTileCoordinates(key: string): [number, number] {
    const config = tileProperties[key] || tileProperties["default"];
    return [config.spriteX, config.spriteY];
  }

  // updating map
  public drawMap() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScoreArea();
    this.drawFooterArea();
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x]) {
          this.drawTile(this.map[y][x]!, x * TILE_DRAW_SIZE, (y + 1) * TILE_DRAW_SIZE);
        }
      }
    }
  }

  drawScoreArea() {
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0, 0, this.canvas.width, TILE_DRAW_SIZE);
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText("SCORE AREA", this.canvas.width / 2 - 60, TILE_DRAW_SIZE / 1.5);
  }

  drawFooterArea() {
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0, this.canvas.height - TILE_DRAW_SIZE, this.canvas.width, TILE_DRAW_SIZE);
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText("GAME FOOTER AREA", this.canvas.width / 2 - 80, this.canvas.height - TILE_DRAW_SIZE / 1.5);
  }

  drawTile(tile: string, x: number, y: number) {
    if (tile !== " ") {
      const [spriteX, spriteY] = this.getTileCoordinates(tile);
      const sprite = new SolidTile(spriteX, spriteY, Tile.size, Tile.size);
      sprite.draw(this.ctx, x, y, TILE_DRAW_SIZE, TILE_DRAW_SIZE);
    }
  }

  addTile(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_DRAW_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_DRAW_SIZE) - 1;

    if (y >= 0 && y < this.map.length) {
      this.map[y][x] = this.selectedTile;
      this.drawMap();
    }
  }

  removeTile(e: MouseEvent) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_DRAW_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_DRAW_SIZE) - 1;

    if (y >= 0 && y < this.map.length) {
      this.map[y][x] = " ";
      this.drawMap();
    }
  }

  saveMap() {
    const daveCount = this.map.flat().filter((tile) => tile === "DA").length;
    const trophyCount = this.map.flat().filter((tile) => tile === "Y").length;

    let errors: string[] = [];
    this.errorMsg.innerText = "";
    this.successMsg.innerText = "";
    if (daveCount === 0) {
      errors.push("At least one Dave must be placed on the map.");
    }
    if (daveCount > 1) {
      errors.push("Only one Dave can be placed on the map.");
    }
    if (trophyCount === 0) {
      errors.push("At least one Trophy must be placed on the map.");
    }
    if (trophyCount > 1) {
      errors.push("Only one Trophy can be placed on the map.");
    }

    if (errors.length === 0) {
      this.output.value = JSON.stringify(this.map.map((row) => row.map((tile) => (tile ? tile : null))));
      this.successMsg.innerText = "Map saved successfully.";
      this.levels[this.levelIndex] = this.map;
      this.startGame();
    } else {
      errors.forEach((msg) => {
        const error = document.createElement("p");
        error.innerText = msg;
        this.errorMsg.appendChild(error);
      });
    }
  }

  prevLevel() {
    if (this.levelIndex > 0) {
      this.levelIndex--;
      this.map = this.levels[this.levelIndex];
      this.drawMap();
    } else {
      this.levelIndex = 0;
    }
  }

  nextLevel() {
    if (this.levelIndex < this.levels.length - 1) {
      this.levelIndex++;
      this.map = this.levels[this.levelIndex];
      this.drawMap();
    } else {
      console.log("Already at the last level");
    }
  }

  startGame() {
    new Game(this.levels);
  }
}

// the editor function is called in the main function
export function startEditor() {
  document.getElementById("splashScreen")!.style.display = "none";
  document.getElementById("editor")!.style.display = "flex";
  const editorInstance = new MapEditor();
  editorInstance.drawMap();
}
