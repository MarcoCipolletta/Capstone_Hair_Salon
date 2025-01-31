import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDayAndTimeComponent } from './choose-day-and-time.component';

describe('ChooseDayAndTimeComponent', () => {
  let component: ChooseDayAndTimeComponent;
  let fixture: ComponentFixture<ChooseDayAndTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseDayAndTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseDayAndTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
