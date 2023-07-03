import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryFilterComponent } from './ministry-filter.component';

describe('MinistryFilterComponent', () => {
  let component: MinistryFilterComponent;
  let fixture: ComponentFixture<MinistryFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinistryFilterComponent]
    });
    fixture = TestBed.createComponent(MinistryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
