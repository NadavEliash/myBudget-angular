import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryIndexComponent } from './ministry-index.component';

describe('MinistryIndexComponent', () => {
  let component: MinistryIndexComponent;
  let fixture: ComponentFixture<MinistryIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinistryIndexComponent]
    });
    fixture = TestBed.createComponent(MinistryIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
