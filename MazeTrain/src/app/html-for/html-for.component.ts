import { Component, OnInit } from '@angular/core';
import {PrimGenerator} from "../api";

@Component({
  selector: 'app-html-for',
  templateUrl: './html-for.component.html',
  styleUrls: ['./html-for.component.less']
})
export class HtmlForComponent implements OnInit {
  grid: number[][] = [];
  cellSize: number = 20; // 默认每个格子的大小
  constructor() { }

  ngOnInit(): void {

    const generator = new PrimGenerator();
    const maze = generator.generateMaze();
    this.grid = maze.getCells();
    (window as any).toMap = () => {
      return this.grid;
    }
  }


  getBackgroundColor(value: number): string {
    switch(value) {
      case 1:
        return 'rgb(245, 245, 245)';
      case 2:
        return 'transparent';
      default:
        return 'rgb(100, 100, 100)';
    }
  }

}
