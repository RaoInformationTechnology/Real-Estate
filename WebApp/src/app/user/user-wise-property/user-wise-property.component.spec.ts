import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWisePropertyComponent } from './user-wise-property.component';

describe('UserWisePropertyComponent', () => {
  let component: UserWisePropertyComponent;
  let fixture: ComponentFixture<UserWisePropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWisePropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWisePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
