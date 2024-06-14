import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprproverEmailComponent } from './apprprover-email.component';

describe('ApprproverEmailComponent', () => {
  let component: ApprproverEmailComponent;
  let fixture: ComponentFixture<ApprproverEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprproverEmailComponent]
    });
    fixture = TestBed.createComponent(ApprproverEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
