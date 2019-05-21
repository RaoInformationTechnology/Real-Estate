import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyListingConformationComponent } from './property-listing-conformation.component';

describe('PropertyListingConformationComponent', () => {
  let component: PropertyListingConformationComponent;
  let fixture: ComponentFixture<PropertyListingConformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyListingConformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyListingConformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
