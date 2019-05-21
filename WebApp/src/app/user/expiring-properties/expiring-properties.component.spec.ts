import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiringPropertiesComponent } from './expiring-properties.component';

describe('ExpiringPropertiesComponent', () => {
  let component: ExpiringPropertiesComponent;
  let fixture: ComponentFixture<ExpiringPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiringPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiringPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
