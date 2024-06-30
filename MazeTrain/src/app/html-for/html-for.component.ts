import {AfterViewInit, Component, OnInit} from '@angular/core';
import {PrimGenerator} from "../api";
import {fr_BE} from "ng-zorro-antd/i18n";
import {HeartArr} from "./heart";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-html-for',
  templateUrl: './html-for.component.html',
  styleUrls: ['./html-for.component.less']
})
export class HtmlForComponent implements OnInit ,AfterViewInit{
  grid: number[][] = [];
  cellSize: number = 20; // 默认每个格子的大小
  finished = false;
  running = false;
  delay= 20;
  collision = 0;
  mazeSize = 10;
  walks = 0;
  connectCollection = false;
  str0 = ''
  str1 = ''

  ngAfterViewInit(): void {
  }

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      this.connectCollection = query.indexOf('__') > -1;
      const vs = query.split('__');
      this.str0 = vs[0];
      this.str1 = vs[1];
    });
    this.finished = false;
    this.running = false;
    this.delay= 20;
    this.collision = 0;
    this.walks = 0;
    const generator = new PrimGenerator(this.mazeSize);
    const maze = generator.generateMaze();
    this.grid = HeartArr;
    this.robotPosition = { x: 1, y: 1, isInWall: 'blue', direction: 'east' }; // Initial position

    (window as any).toMap = () => {
      return this.grid;
    }
    this.grid[this.grid.length-2][this.grid[this.grid.length-2].length-2] = 5
    this.moveRobot();
  }


  getBackgroundColor(value: number): string {
    switch(value) {
      case 1:
        return 'rgb(245, 245, 245)';
      case 5:
        return 'rgb(89, 245, 245)';
      case 2:
        return 'rgb(180, 180, 180)';
      default:
        return 'rgb(100, 100, 100)';
    }
  }

  robotPosition = { x: 1, y: 1, isInWall: 'blue', direction: 'east' }; // Initial position

  moveRobot(): void {
    if (!this.running) {
      return;
    }
    if (this.finished) {
      return;
    }
    this.walks++;
    const directions = ['north', 'east', 'south', 'west'];
    const randomDirection = directions[Math.floor(Math.random() * 4)];
    this.robotPosition.direction = randomDirection;

    switch (randomDirection) {
      case 'north':
        if (this.grid[this.robotPosition.y - 1][this.robotPosition.x] !== 3) {
          this.robotPosition.y--;
          this.robotPosition.isInWall = 'blue';
         if (this.grid[this.robotPosition.y - 1][this.robotPosition.x] == 5) {
           this.robotPosition.isInWall = 'green';
         }}else {
          this.robotPosition.isInWall = 'red';
        }
        break;
      case 'east':
        if (this.grid[this.robotPosition.y][this.robotPosition.x + 1] !== 3) {
          this.robotPosition.x++;
          this.robotPosition.isInWall = 'blue';
           if (this.grid[this.robotPosition.y][this.robotPosition.x + 1] == 5) {
             this.robotPosition.isInWall = 'green';
           }
        }else {
          this.robotPosition.isInWall = 'red';
        }
        break;
      case 'south':
        if (this.grid[this.robotPosition.y + 1][this.robotPosition.x] !== 3) {
          this.robotPosition.y++;
          this.robotPosition.isInWall = 'blue';
          if (this.grid[this.robotPosition.y+1][this.robotPosition.x] == 5) {
            this.robotPosition.isInWall = 'green';
          }
        }else {
          this.robotPosition.isInWall = 'red';
        }
        break;
      case 'west':
        if (this.grid[this.robotPosition.y][this.robotPosition.x - 1] !== 3) {
          this.robotPosition.x--;
          this.robotPosition.isInWall = 'blue';
         if (this.grid[this.robotPosition.y][this.robotPosition.x- 1] == 5){
          this.robotPosition.isInWall = 'green';
        }}else {
          this.robotPosition.isInWall = 'red';
        }
        break;
    }

    if ('green' === this.robotPosition.isInWall) {
      this.finished = true;
      this.running = false;
      console.log('Robot reached the end!')
    }else if ('red' === this.robotPosition.isInWall) {
      this.collision++;
    }
    // Check collision
    if (this.grid[this.robotPosition.y][this.robotPosition.x] === 3) {
      // Collision with wall, change color
      console.log('Robot collided with wall!');
    }

    // Update maze
    this.grid[this.robotPosition.y][this.robotPosition.x] = 2;

    // Repeat movement
    setTimeout(() => {
      this.moveRobot();
    }, this.delay); // Adjust the interval as needed
  }

  isRobotPosition(row: number, col: number): boolean {
    // 判断当前格子是否是机器人的位置
    return this.robotPosition.x === col && this.robotPosition.y === row;
  }

  restart() {
    this.ngOnInit();
  }

  run() {
    this.running = !this.running;
    if (this.running) {
      this.moveRobot();
    }
  }

  rev(i: number, j: number) {
    if (this.grid[i][j] == 3) {
      this.grid[i][j] = 1;
    }else {
      this.grid[i][j] = 3;
    }
  }
}
