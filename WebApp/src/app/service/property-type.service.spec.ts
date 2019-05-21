import { TestBed, inject } from '@angular/core/testing';

import { PropertyTypeService } from './property-type.service';

describe('PropertyTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyTypeService]
    });
  });

  it('should be created', inject([PropertyTypeService], (service: PropertyTypeService) => {
    expect(service).toBeTruthy();
  }));
});
