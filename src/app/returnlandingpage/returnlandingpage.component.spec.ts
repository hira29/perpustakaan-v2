import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnlandingpageComponent } from './returnlandingpage.component';

describe('ReturnlandingpageComponent', () => {
  let component: ReturnlandingpageComponent;
  let fixture: ComponentFixture<ReturnlandingpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnlandingpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnlandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
