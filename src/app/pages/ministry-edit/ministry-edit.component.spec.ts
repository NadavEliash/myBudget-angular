import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryEditComponent } from './ministry-edit.component';

describe('MinistryEditComponent', () => {
  let component: MinistryEditComponent;
  let fixture: ComponentFixture<MinistryEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinistryEditComponent]
    });
    fixture = TestBed.createComponent(MinistryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
