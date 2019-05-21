import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendPendingRequestComponent } from './extend-pending-request.component';

describe('ExtendPendingRequestComponent', () => {
  let component: ExtendPendingRequestComponent;
  let fixture: ComponentFixture<ExtendPendingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendPendingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendPendingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
