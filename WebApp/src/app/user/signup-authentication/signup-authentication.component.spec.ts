import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupAuthenticationComponent } from './signup-authentication.component';

describe('SignupAuthenticationComponent', () => {
  let component: SignupAuthenticationComponent;
  let fixture: ComponentFixture<SignupAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
