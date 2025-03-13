import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpartnerprofileComponent } from './dpartnerprofile.component';

describe('DpartnerprofileComponent', () => {
  let component: DpartnerprofileComponent;
  let fixture: ComponentFixture<DpartnerprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpartnerprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpartnerprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
