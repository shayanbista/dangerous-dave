import { SolidTile } from "./tiles/SolidTile";
import { startEditor } from "./CustomEditorLevel";
import { MainGame } from "./MainGame";

let gameState = { NOT_STARTED: true, RUNNING: false, ENDED: false, editorNotStarted: false };
class SplashScreen {
  private ctx: CanvasRenderingContext2D;
  private bannerImage: HTMLImageElement;
  private bannerFrames: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  private currentFrame: number;
  private frameDelay: number;
  private frameCounter: number;
  private mapStructure: string[][];
  private fireFrames: { x: number; y: number }[];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.bannerImage = new Image();
    this.bannerImage.src = "assets/sprites/banner.png";
    this.bannerFrames = [
      { x: 0, y: 0, width: 112, height: 47 },
      { x: 112, y: 0, width: 112, height: 47 },
      { x: 224, y: 0, width: 112, height: 47 },
      { x: 336, y: 0, width: 112, height: 47 },
    ];
    this.currentFrame = 0;
    this.frameDelay = 10;
    this.frameCounter = 0;
    this.mapStructure = [
      ["K", " ", "K", "K", "K", "K", " ", "K", " ", "K"],
      ["K", " ", "K", "C", " ", " ", " ", " ", " ", "K"],
      ["K", " ", "K", " ", " ", "K", "K", "K", "", "K"],
      ["K", " ", "K", " ", " ", " ", " ", " ", "C", "K"],
      ["K", " ", "K", "F", "K", "K", "K", " ", " ", "K"],
      ["K", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      ["K", "K", "K", "K", "K", "K", "K", "K", "F", "K"],
    ];
    this.fireFrames = [
      { x: 0, y: 5 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
    ];
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawBanner();
    this.drawMap();
    this.drawText();
  }

  drawBanner() {
    const frame = this.bannerFrames[this.currentFrame];
    const scale = 3;

    this.ctx.drawImage(
      this.bannerImage,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      this.ctx.canvas.width / 2 - (frame.width * scale) / 2,
      10,
      frame.width * scale,
      frame.height * scale
    );

    this.frameCounter++;
    if (this.frameCounter > this.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame = (this.currentFrame + 1) % this.bannerFrames.length;
    }
  }

  drawMap() {
    const offsetX = (this.ctx.canvas.width - this.mapStructure[0].length * 50) / 2;
    const offsetY = 150;

    for (let y = 0; y < this.mapStructure.length; y++) {
      for (let x = 0; x < this.mapStructure[y].length; x++) {
        let tile = this.mapStructure[y][x];
        if (tile) {
          this.drawTile(tile, x * 50 + offsetX, y * 50 + offsetY);
        }
      }
    }
  }

  drawTile(tile: string, x: number, y: number) {
    let spriteX: number, spriteY: number;
    switch (tile) {
      case "K":
        [spriteX, spriteY] = [3, 0];
        break;
      case "C":
        [spriteX, spriteY] = [6, 1];
        break;
      case "F": {
        const frame = this.fireFrames[this.currentFrame];
        spriteX = frame.x;
        spriteY = frame.y;
        break;
      }
      default:
        return;
    }
    const sprite = new SolidTile(spriteX, spriteY, 64, 64);
    sprite.draw(this.ctx, x, y, 50, 50);
  }

  drawText() {
    this.ctx.font = "25px Silkscreen";
    this.ctx.fillStyle = "white";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText("PRESS S TO START GAME", this.ctx.canvas.width / 2, this.ctx.canvas.height - 70);
    this.ctx.fillText("PRESS SPACEBAR TO BUILD CUSTOM MAP", this.ctx.canvas.width / 2, this.ctx.canvas.height - 30);
  }
}

export function initializeSplashScreen() {
  const splashCanvas = document.getElementById("splashCanvas") as HTMLCanvasElement;
  const splashCtx = splashCanvas.getContext("2d")!;
  const splashScreen = new SplashScreen(splashCtx);
  function animate() {
    splashScreen.draw();
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("keydown", (e) => {
    if (e.key === "s" || e.key === "S") {
      if (gameState.NOT_STARTED) {
        new MainGame();
        gameState.RUNNING = true;
        gameState.NOT_STARTED = false;
        console.log("gamestate", gameState);
      } else {
        console.log("already initialzed");
      }
      document.getElementById("splashScreen")!.style.display = "none";
    } else if (e.code === "Space") {
      if (gameState.RUNNING) {
        console.log("cant open");
      } else {
        gameState.editorNotStarted = false;
        document.getElementById("splashScreen")!.style.display = "none";
        startEditor();
      }
    }
  });
}
