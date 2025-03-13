import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpartnerdashboardComponent } from './dpartnerdashboard.component';

describe('DpartnerdashboardComponent', () => {
  let component: DpartnerdashboardComponent;
  let fixture: ComponentFixture<DpartnerdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpartnerdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpartnerdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
