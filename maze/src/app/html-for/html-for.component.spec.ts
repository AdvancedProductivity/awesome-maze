import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlForComponent } from './html-for.component';

describe('HtmlForComponent', () => {
  let component: HtmlForComponent;
  let fixture: ComponentFixture<HtmlForComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlForComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
