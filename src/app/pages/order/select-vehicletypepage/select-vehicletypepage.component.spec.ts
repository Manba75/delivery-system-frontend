import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVehicletypepageComponent } from './select-vehicletypepage.component';

describe('SelectVehicletypepageComponent', () => {
  let component: SelectVehicletypepageComponent;
  let fixture: ComponentFixture<SelectVehicletypepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectVehicletypepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectVehicletypepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
