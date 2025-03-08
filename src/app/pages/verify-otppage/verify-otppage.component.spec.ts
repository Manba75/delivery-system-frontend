import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOTPpageComponent } from './verify-otppage.component';

describe('VerifyOTPpageComponent', () => {
  let component: VerifyOTPpageComponent;
  let fixture: ComponentFixture<VerifyOTPpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyOTPpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyOTPpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
