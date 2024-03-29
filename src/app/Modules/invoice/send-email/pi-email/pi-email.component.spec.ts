import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIEmailComponent } from './pi-email.component';

describe('PIEmailComponent', () => {
  let component: PIEmailComponent;
  let fixture: ComponentFixture<PIEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PIEmailComponent]
    });
    fixture = TestBed.createComponent(PIEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
