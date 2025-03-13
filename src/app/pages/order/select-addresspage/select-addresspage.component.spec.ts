import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAddresspageComponent } from './select-addresspage.component';

describe('SelectAddresspageComponent', () => {
  let component: SelectAddresspageComponent;
  let fixture: ComponentFixture<SelectAddresspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAddresspageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAddresspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
