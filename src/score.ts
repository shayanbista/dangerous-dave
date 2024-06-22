export class Score {
  private ctx: CanvasRenderingContext2D;
  private score: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.score = 0;
    this.ctx = ctx;
  }

  updateDisplay(
    score: number,
    level: number,
    lives: number,
    message: string | null
  ) {
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, 50);
    if (message == null) {
      this.ctx.fillStyle = "white";
      this.ctx.font = "bold 24px Arial";
      this.ctx.fillText(`Score: ${score}`, 10, 30);
      this.ctx.fillText(`Level: ${level}`, 200, 30);
      this.ctx.fillText(`Lives: ${lives}`, 400, 30);
    } else {
      this.ctx.fillStyle = "white";
      this.ctx.font = "bold 24px Arial";
      this.ctx.fillText(message, 10, 30);
    }
  }
}
