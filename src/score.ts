export class Score {
  value: number;
  lastLevel: number;
  currentLevel: number;
  lives: number;
  sprites: {
    [key: string]: {
      draw: (
        ctx: CanvasRenderingContext2D | null,
        x: number,
        y: number
      ) => void;
    };
  };
}
