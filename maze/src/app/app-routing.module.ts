import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HtmlForComponent} from "./html-for/html-for.component";
import {AppComponent} from "./app.component";
import {InfiniteComponent} from "./infinite/infinite.component";

const routes: Routes = [

  { path: '', redirectTo: '/html', pathMatch: 'full' }, // 默认重定向到 home
  { path: 'html', component: HtmlForComponent },
  { path: 'infinite', component: InfiniteComponent },
  { path: 'canvas', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
