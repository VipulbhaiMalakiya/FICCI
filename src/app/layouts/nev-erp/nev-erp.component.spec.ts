import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NevErpComponent } from './nev-erp.component';

describe('NevErpComponent', () => {
  let component: NevErpComponent;
  let fixture: ComponentFixture<NevErpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NevErpComponent]
    });
    fixture = TestBed.createComponent(NevErpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
