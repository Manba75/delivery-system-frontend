import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturebtnComponent } from './featurebtn.component';

describe('FeaturebtnComponent', () => {
  let component: FeaturebtnComponent;
  let fixture: ComponentFixture<FeaturebtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturebtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturebtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
