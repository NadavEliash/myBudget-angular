import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryPreviewComponent } from './ministry-preview.component';

describe('MinistryPreviewComponent', () => {
  let component: MinistryPreviewComponent;
  let fixture: ComponentFixture<MinistryPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinistryPreviewComponent]
    });
    fixture = TestBed.createComponent(MinistryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
