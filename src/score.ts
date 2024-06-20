export class Score {
  private ctx: CanvasRenderingContext2D;
  private score: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.score = 0;
    this.ctx = ctx;
  }

  reset() {
    this.score = 0;
    this.updateDisplay();
  }

  increment() {
    this.score += 1;
  }

  updateDisplay() {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.fillStyle = "white";
    // this.ctx.font = "bold 24px Arial";
    // this.ctx.fillText(`Score: ${this.score}`, 10, 30);

    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillText(`LEVEL ${3}`, 400, 30);

    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillText(`DAVES ${3}`, 800, 30);
  }
}
