import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistroryComponent } from './order-histrory.component';

describe('OrderHistroryComponent', () => {
  let component: OrderHistroryComponent;
  let fixture: ComponentFixture<OrderHistroryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderHistroryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHistroryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
