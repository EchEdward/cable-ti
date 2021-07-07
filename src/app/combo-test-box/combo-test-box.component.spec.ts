import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboTestBoxComponent } from './combo-test-box.component';

describe('ComboTestBoxComponent', () => {
  let component: ComboTestBoxComponent;
  let fixture: ComponentFixture<ComboTestBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboTestBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboTestBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
