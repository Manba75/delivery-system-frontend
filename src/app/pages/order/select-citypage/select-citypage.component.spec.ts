import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCitypageComponent } from './select-citypage.component';

describe('SelectCitypageComponent', () => {
  let component: SelectCitypageComponent;
  let fixture: ComponentFixture<SelectCitypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCitypageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCitypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
