import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryloanComponent } from './historyloan.component';

describe('HistoryloanComponent', () => {
  let component: HistoryloanComponent;
  let fixture: ComponentFixture<HistoryloanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryloanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
