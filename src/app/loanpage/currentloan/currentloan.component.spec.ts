import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentloanComponent } from './currentloan.component';

describe('CurrentloanComponent', () => {
  let component: CurrentloanComponent;
  let fixture: ComponentFixture<CurrentloanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentloanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
