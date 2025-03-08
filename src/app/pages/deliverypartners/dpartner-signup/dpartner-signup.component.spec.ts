import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpartnerSignupComponent } from './dpartner-signup.component';

describe('DpartnerSignupComponent', () => {
  let component: DpartnerSignupComponent;
  let fixture: ComponentFixture<DpartnerSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpartnerSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpartnerSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
