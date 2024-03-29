import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedSalesNoteNewComponent } from './posted-sales-note-new.component';

describe('PostedSalesNoteNewComponent', () => {
  let component: PostedSalesNoteNewComponent;
  let fixture: ComponentFixture<PostedSalesNoteNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostedSalesNoteNewComponent]
    });
    fixture = TestBed.createComponent(PostedSalesNoteNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
