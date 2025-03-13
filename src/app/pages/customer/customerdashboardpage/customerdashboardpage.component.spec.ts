import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerdashboardpageComponent } from './customerdashboardpage.component';

describe('CustomerdashboardpageComponent', () => {
  let component: CustomerdashboardpageComponent;
  let fixture: ComponentFixture<CustomerdashboardpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerdashboardpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerdashboardpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
