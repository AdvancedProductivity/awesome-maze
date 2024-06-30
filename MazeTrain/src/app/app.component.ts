import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PrimGenerator } from './api';
import {debounceTime, distinctUntilChanged, merge, Subject, throttleTime} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'MazeTrain';
  editorOptions = { theme: 'vs-dark', language: 'javascript' };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  originalCode: string = 'function x() { // TODO }';
  @ViewChild('myCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  size = 15 * 15 * 30;
  mousePosition = { x: 0, y: 0 };
  grid: number[][] = [
    [1, 1, 2, 1, 2],
    [2, 1, 1, 2, 1],
    [1, 2, 2, 1, 1],
    [2, 1, 1, 1, 2],
    [1, 2, 1, 2, 2]
  ];
  cellSize: number = 20; // 默认每个格子的大小
  curX = 0;
  curY = 0;
  e: any;
  private render = new Subject<{ev: WheelEvent, cellSize: number}>();

  constructor() {}

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.adjustCanvasSize();
    this.drawGrid();


    this.canvasRef.nativeElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      // 检查是否按下了 Alt 键
      const isAltPressed = e.altKey;
      // 检查是否按下了 Command 键（Meta 键）
      const isCommandPressed = e.metaKey;
      this.e = e;
      const delta = Math.sign(e.deltaY);
      if (isAltPressed || isCommandPressed) {
        // 在按下 Alt 键的情况下执行缩放操作
        console.log('zzq see get', this.cellSize);
        let val = {cellSize: this.cellSize} as {ev: WheelEvent, cellSize: number};
        val = JSON.parse(JSON.stringify(val))
        val.ev = e;
        this.render.next(val);
        if (delta > 0) {
          this.zoomOut();
        } else {
          this.zoomIn();
        }
      } else {
        // 在未按下 Alt 键的情况下执行默认操作（防止浏览器默认滚动行为）
        e.preventDefault();
      }
    });



    // 监听鼠标移动事件，更新鼠标位置
    this.canvasRef.nativeElement.addEventListener('mousemove', (e) => {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      this.mousePosition.x = e.clientX - rect.left;
      this.mousePosition.y = e.clientY - rect.top;
    });
    this.canvasRef.nativeElement.addEventListener('click', (e) => {
      // const newXStart = this.findStartPoint(currentX, e.clientX, newCellSize, this.grid);
    });

  }

  adjustCanvasSize(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 根据屏幕分辨率和设备像素比例调整画布大小
    canvas.width = 800;
    canvas.height = 700;

    // 缩放 Canvas 绘图上下文以适应设备像素比例
    // this.ctx.scale(dpr, dpr);
  }

  drawGrid(startX: number = 0, startY: number = 0, endX = 40, endY = 35): void {
    console.log('zzq see drawGrid', startX, startY, endX, endY);
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    // this.canvasRef.nativeElement.height = canvasHeight;

    for (let i = startX; i < Math.min(endX, this.grid.length); i++) {
      for (let j = startY; j < Math.min(endY, this.grid[i].length); j++) {
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
    (window as any).toMap = () => {
      return this.grid;
    }


    const throttled = this.render.pipe(
      throttleTime(300) // 在300毫秒内只处理第一次事件
    );

    const debounced = this.render.pipe(
      debounceTime(300), // 等待300毫秒处理最后一次事件
      distinctUntilChanged() // 防止相同的输入重复触发
    );

    merge(throttled, debounced).subscribe(value => {
      this.reren(value);
    });
  }

  // 缩放事件处理函数
  zoomIn(): void {
    this.cellSize += 0.3; // 增加每个格子的大小
  }

  zoomOut(): void {
    if (this.cellSize > 2) {
      this.cellSize -= 0.3;
    }
  }

  private reren(e: { ev: WheelEvent, cellSize: number}){
    const {x, y} = this.findLoation(e.ev.clientX, e.ev.clientY, e.cellSize, this.grid);
    console.log('cell focus on', x, y);
    let newStartX = x;
    let newStartY = y;
    let endX = x;
    let endY = y;
    const newCellSize = this.cellSize;
    let yPx = e.ev.clientY;
    while (yPx> newCellSize) {
      yPx -= newCellSize;
      newStartY--;
      if (newStartY == 0) {
        break;
      }
    }
    let xPx = e.ev.clientX;
    while (xPx > newCellSize) {
      xPx -= newCellSize;
      newStartX--;
      if (newStartX == 0) {
        break;
      }
    }

    yPx = e.ev.clientY;
    xPx = e.ev.clientX;
    while (yPx < 700) {
      yPx += newCellSize;
      endY++;
    }
    while (xPx < 800) {
      xPx += newCellSize;
      endX++;
    }
    this.drawGrid(newStartX, newStartY, endX, endY);
  }

  private findLoation(clientX: number, clientY: number, cellSize: number, grid: number[][]) {
    console.log('cell size', cellSize);
    const x = Math.floor(clientX / cellSize);
    const y = Math.floor(clientY / cellSize);
    return {x, y};
  }


}
