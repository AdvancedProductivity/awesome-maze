import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PrimGenerator} from "./api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'MazeTrain';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  originalCode: string = 'function x() { // TODO }';
  @ViewChild('myCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  size = 15 * 15 * 30;
  grid: number[][] = [
    [1, 1, 2, 1, 2],
    [2, 1, 1, 2, 1],
    [1, 2, 2, 1, 1],
    [2, 1, 1, 1, 2],
    [1, 2, 1, 2, 2]
  ];
  cellSize: number = 1;

  constructor() { }

  ngAfterViewInit(): void {
    // @ts-ignore
    this.ctx = (this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d');
    this.adjustCanvasSize();
    this.drawGrid();
  }

  adjustCanvasSize(): void {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Adjust canvas size based on screen resolution and device pixel ratio
    canvas.width = screenWidth * dpr;
    canvas.height = screenHeight * dpr;

    // Scale canvas drawing context to account for device pixel ratio
    this.ctx.scale(dpr, dpr);
  }

  drawGrid(): void {
    console.log(this.grid);
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const color = this.grid[i][j] === 3 ? 'rgb(100, 100, 100)' : 'rgb(245, 245, 245)';
        this.ctx.fillStyle = color;
        this.ctx.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }
  ngOnInit(): void {
    const generator = new PrimGenerator();
    const maze = generator.generateMaze();
    this.grid = maze.getCells();
    console.log(maze.getCells());
  }

}
