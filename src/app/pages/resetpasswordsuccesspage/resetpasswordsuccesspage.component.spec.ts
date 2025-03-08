import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordsuccesspageComponent } from './resetpasswordsuccesspage.component';

describe('ResetpasswordsuccesspageComponent', () => {
  let component: ResetpasswordsuccesspageComponent;
  let fixture: ComponentFixture<ResetpasswordsuccesspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetpasswordsuccesspageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetpasswordsuccesspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
