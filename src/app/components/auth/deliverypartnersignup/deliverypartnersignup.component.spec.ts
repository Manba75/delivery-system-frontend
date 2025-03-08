import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverypartnersignupComponent } from './deliverypartnersignup.component';

describe('DeliverypartnersignupComponent', () => {
  let component: DeliverypartnersignupComponent;
  let fixture: ComponentFixture<DeliverypartnersignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverypartnersignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverypartnersignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
