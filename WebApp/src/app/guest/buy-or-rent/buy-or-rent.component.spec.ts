import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyOrRentComponent } from './buy-or-rent.component';

describe('BuyOrRentComponent', () => {
  let component: BuyOrRentComponent;
  let fixture: ComponentFixture<BuyOrRentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyOrRentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyOrRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
