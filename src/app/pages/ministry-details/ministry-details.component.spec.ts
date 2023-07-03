import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryDetailsComponent } from './ministry-details.component';

describe('MinistryDetailsComponent', () => {
  let component: MinistryDetailsComponent;
  let fixture: ComponentFixture<MinistryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinistryDetailsComponent]
    });
    fixture = TestBed.createComponent(MinistryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
