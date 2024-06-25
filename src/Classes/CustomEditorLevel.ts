import { SolidTile } from "./tiles/SolidTile";
import { CombinedLevelMap, CustomMap, LEVEL1_MAP } from "../levels";
import { Game } from "./Game/GameEngine";
import { tileConfig } from "../tileConfig";
import { Tile } from "./tiles/Tile";
import { TILE_SIZE } from "../constant";

const DRAW_SIZE = TILE_SIZE;

export class CustomEditorLevel {
  private mapCanvas: HTMLCanvasElement;
  private mapCtx: CanvasRenderingContext2D;
  private tileSelector: HTMLElement;
  private saveButton: HTMLButtonElement;
  private prevLevelButton: HTMLButtonElement;
  private nextLevelButton: HTMLButtonElement;
  private output: HTMLTextAreaElement;
  private errorDisplay: HTMLElement;
  private successDisplay: HTMLElement;
  private currentTile: string;
  private map: string[][];
  private tilesetImage: HTMLImageElement;
  private levels: string[][][];
  private currentLevelIndex: number;

  constructor() {
    this.mapCanvas = document.getElementById("map") as HTMLCanvasElement;
    this.mapCtx = this.mapCanvas.getContext("2d")!;
    this.tileSelector = document.getElementById("tileSelector") as HTMLElement;
    this.mapCanvas.style.background = "red";
    this.saveButton = document.getElementById("save") as HTMLButtonElement;
    this.prevLevelButton = document.getElementById("previous-level") as HTMLButtonElement;
    this.nextLevelButton = document.getElementById("next-level") as HTMLButtonElement;

    this.output = document.createElement("textarea");
    this.errorDisplay = document.getElementById("errorDisplay")!;
    this.successDisplay = document.getElementById("successDisplay")!;
    this.currentTile = "B";
    this.levels = [LEVEL1_MAP, CustomMap, CombinedLevelMap];
    this.currentLevelIndex = 0;
    this.map = this.levels[this.currentLevelIndex];

    this.tilesetImage = new Image();
    this.tilesetImage.src = "assets/sprites/tileset.png";

    this.init();
  }

  private init() {
    this.errorDisplay.style.color = "red";
    this.successDisplay.style.color = "green";

    this.tilesetImage.onload = () => {
      this.drawTileSelector();
      this.drawMap();
    };

    this.tilesetImage.onerror = () => {
      console.error("Failed to load tileset image");
    };

    this.mapCanvas.addEventListener("click", this.handleCanvasClick.bind(this));
    this.mapCanvas.addEventListener("contextmenu", this.handleCanvasRightClick.bind(this));

    this.prevLevelButton.addEventListener("click", this.prevLevel.bind(this));
    this.nextLevelButton.addEventListener("click", this.nextLevel.bind(this));
    this.saveButton.addEventListener("click", this.saveMap.bind(this));
  }

  private drawTileSelector() {
    this.tileSelector.innerHTML = "";
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
      Jetpack: "J",
      ExitDoor: "E",
    };

    Object.keys(TILES).forEach((key, index) => {
      const tileBox = document.createElement("div");
      tileBox.classList.add("tile-box");
      tileBox.dataset.tile = TILES[key];
      if (TILES[key] === this.currentTile) {
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
      this.tileSelector.appendChild(tileBox);

      tileBox.addEventListener("click", () => {
        this.currentTile = tileBox.dataset.tile!;
        document.querySelectorAll(".tile-box").forEach((box) => box.classList.remove("selected"));
        tileBox.classList.add("selected");
      });
    });
  }

  private getTileCoordinates(key: string): [number, number] {
    const config = tileConfig[key] || tileConfig.default;
    return [config.spriteX, config.spriteY];
  }

  public drawMap() {
    this.mapCtx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
    this.drawScoreArea();
    this.drawFooterArea();
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x]) {
          this.drawTile(this.map[y][x]!, x * DRAW_SIZE, (y + 1) * DRAW_SIZE);
        }
      }
    }
  }

  drawScoreArea() {
    this.mapCtx.fillStyle = "gray";
    this.mapCtx.fillRect(0, 0, this.mapCanvas.width, DRAW_SIZE);
    this.mapCtx.fillStyle = "white";
    this.mapCtx.font = "bold 16px Arial";
    this.mapCtx.fillText("SCORE AREA", this.mapCanvas.width / 2 - 60, DRAW_SIZE / 1.5);
  }

  drawFooterArea() {
    this.mapCtx.fillStyle = "gray";
    this.mapCtx.fillRect(0, this.mapCanvas.height - DRAW_SIZE, this.mapCanvas.width, DRAW_SIZE);
    this.mapCtx.fillStyle = "white";
    this.mapCtx.font = "bold 16px Arial";
    this.mapCtx.fillText("GAME FOOTER AREA", this.mapCanvas.width / 2 - 80, this.mapCanvas.height - DRAW_SIZE / 1.5);
  }

  drawTile(tile: string, x: number, y: number) {
    if (tile !== " ") {
      const [spriteX, spriteY] = this.getTileCoordinates(tile);
      const sprite = new SolidTile(spriteX, spriteY, Tile.size, Tile.size);
      sprite.draw(this.mapCtx, x, y, DRAW_SIZE, DRAW_SIZE);
    }
  }

  handleCanvasClick(e: MouseEvent) {
    const rect = this.mapCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / DRAW_SIZE);
    const y = Math.floor((e.clientY - rect.top) / DRAW_SIZE) - 1;

    if (y >= 0 && y < this.map.length) {
      this.map[y][x] = this.currentTile;
      this.drawMap();
    }
  }

  handleCanvasRightClick(e: MouseEvent) {
    e.preventDefault();
    const rect = this.mapCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / DRAW_SIZE);
    const y = Math.floor((e.clientY - rect.top) / DRAW_SIZE) - 1;

    if (y >= 0 && y < this.map.length) {
      this.map[y][x] = " ";
      this.drawMap();
    }
  }

  saveMap() {
    const daveCount = this.map.flat().filter((tile) => tile === "DA").length;
    const trophyCount = this.map.flat().filter((tile) => tile === "Y").length;

    let errorMessages: string[] = [];
    this.errorDisplay.innerText = "";
    this.successDisplay.innerText = "";
    if (daveCount === 0) {
      errorMessages.push("At least one Dave must be placed on the map.");
    }
    if (daveCount > 1) {
      errorMessages.push("Only one Dave can be placed on the map.");
    }
    if (trophyCount === 0) {
      errorMessages.push("At least one Trophy must be placed on the map.");
    }
    if (trophyCount > 1) {
      errorMessages.push("Only one Trophy can be placed on the map.");
    }

    if (errorMessages.length === 0) {
      this.output.value = JSON.stringify(this.map.map((row) => row.map((tile) => (tile ? tile : null))));
      this.successDisplay.innerText = "Map saved successfully.";
      this.levels[this.currentLevelIndex] = this.map;
      this.drawGameCanvas();
    } else {
      errorMessages.forEach((msg) => {
        const errorMessage = document.createElement("p");
        errorMessage.innerText = msg;
        this.errorDisplay.appendChild(errorMessage);
      });
    }
  }

  prevLevel() {
    if (this.currentLevelIndex > 0) {
      this.currentLevelIndex--;
      this.map = this.levels[this.currentLevelIndex];
      this.drawMap();
    } else {
      this.currentLevelIndex = 0;
    }
  }

  nextLevel() {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      this.map = this.levels[this.currentLevelIndex];
      this.drawMap();
    } else {
      console.log("Already at the last level");
    }
  }

  drawGameCanvas() {
    new Game(this.levels);
  }
}

export function startEditor() {
  document.getElementById("splashScreen")!.style.display = "none";
  document.getElementById("editor")!.style.display = "flex";
  const editorInstance = new CustomEditorLevel();
  editorInstance.drawMap();
}
