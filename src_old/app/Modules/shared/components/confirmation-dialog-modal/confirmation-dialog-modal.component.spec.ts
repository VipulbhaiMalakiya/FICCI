import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogModalComponent } from './confirmation-dialog-modal.component';

describe('ConfirmationDialogModalComponent', () => {
  let component: ConfirmationDialogModalComponent;
  let fixture: ComponentFixture<ConfirmationDialogModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationDialogModalComponent]
    });
    fixture = TestBed.createComponent(ConfirmationDialogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
