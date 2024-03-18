import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedEmailComponent } from './posted-email.component';

describe('PostedEmailComponent', () => {
  let component: PostedEmailComponent;
  let fixture: ComponentFixture<PostedEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostedEmailComponent]
    });
    fixture = TestBed.createComponent(PostedEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
