import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpartnerdashboardpageComponent } from './dpartnerdashboardpage.component';

describe('DpartnerdashboardpageComponent', () => {
  let component: DpartnerdashboardpageComponent;
  let fixture: ComponentFixture<DpartnerdashboardpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpartnerdashboardpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpartnerdashboardpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
