import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformationModelComponent } from './conformation-model.component';

describe('ConformationModelComponent', () => {
  let component: ConformationModelComponent;
  let fixture: ComponentFixture<ConformationModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConformationModelComponent]
    });
    fixture = TestBed.createComponent(ConformationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
