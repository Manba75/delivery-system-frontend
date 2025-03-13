import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpartnerprofilepageComponent } from './dpartnerprofilepage.component';

describe('DpartnerprofilepageComponent', () => {
  let component: DpartnerprofilepageComponent;
  let fixture: ComponentFixture<DpartnerprofilepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpartnerprofilepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpartnerprofilepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
