// export class Score {
//   value: number;
//   canvas: HTMLCanvasElement;
//   ctx: CanvasRenderingContext2D | null;

//   constructor() {
//     this.value = 0;
//     this.canvas = document.getElementById("map") as HTMLCanvasElement;
//     this.ctx = this.canvas.getContext("2d")!;
//   }

//   drawBoard() {
//     debugger
//     if (this.ctx) {
//       this.ctx.fillStyle = "#000";
//       this.ctx.fillRect(0, 0, 1000, 200);
//       this.ctx.fillStyle = "#e5dfe4";
//       this.ctx.fillRect(0, this.canvas.height - 4, this.canvas.width, 4);
//       this.ctx.fillStyle = "#90ee90";
//       this.ctx.font = "20px GameFont";
//       this.ctx.textAlign = "center";
//       this.ctx.fillText("this is a test", this.canvas.width / 2, 28);
//     }
//   }
// }

export class Score {
  private score: number;
  private highScore: number;
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.score = 0;
    this.highScore = 0;
    this.ctx = ctx;
  }

  public increaseScore(points: number): void {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.drawScore();
  }

  public resetScore(): void {
    this.score = 0;
    this.drawScore();
  }

  public drawScore(): void {
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, 50);
    // this.ctx.fillStyle = "gray";
    // this.ctx.fillRect(0, 0, this.ctx.canvas.width, 50);
    // this.ctx.font = "20px Arial";
    // this.ctx.fillStyle = "white";
    // this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    // this.ctx.fillText(`High Score: ${this.highScore}`, 200, 30);
    console.log("this is drawscore ctx", this.ctx);
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0, 0, 1000, 50);
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText("SCORE AREA", 1000 / 2 - 60, 50 / 1.5);
  }
}
