import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanpageComponent } from './loanpage.component';

describe('LoanpageComponent', () => {
  let component: LoanpageComponent;
  let fixture: ComponentFixture<LoanpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
