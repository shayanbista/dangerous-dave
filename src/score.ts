export class Score {
  private ctx: CanvasRenderingContext2D;
  private score: number;
  private canvas: HTMLCanvasElement;

  constructor(gameCanvas: HTMLCanvasElement) {
    this.score = 0;
    this.canvas = document.createElement("canvas");
    this.canvas.width = gameCanvas.width;
    this.canvas.height = 100;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "2";
    this.canvas.style.backgroundColor = "red";
    this.canvas.style.pointerEvents = "none";
    gameCanvas.parentElement?.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
  }

  reset() {
    this.score = 0;
    this.updateDisplay();
  }

  increment() {
    this.score += 1;
  }

  updateDisplay() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
  }

  show() {
    this.canvas.style.display = "block";
  }

  hide() {
    this.canvas.style.display = "none";
  }
}
