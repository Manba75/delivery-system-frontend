import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTrackingpageComponent } from './live-trackingpage.component';

describe('LiveTrackingpageComponent', () => {
  let component: LiveTrackingpageComponent;
  let fixture: ComponentFixture<LiveTrackingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveTrackingpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveTrackingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
