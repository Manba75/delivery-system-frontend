import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVehicletypeComponent } from './select-vehicletype.component';

describe('SelectVehicletypeComponent', () => {
  let component: SelectVehicletypeComponent;
  let fixture: ComponentFixture<SelectVehicletypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectVehicletypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectVehicletypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
