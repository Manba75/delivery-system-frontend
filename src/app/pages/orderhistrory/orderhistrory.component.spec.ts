import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderhistroryComponent } from './orderhistrory.component';

describe('OrderhistroryComponent', () => {
  let component: OrderhistroryComponent;
  let fixture: ComponentFixture<OrderhistroryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderhistroryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderhistroryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
