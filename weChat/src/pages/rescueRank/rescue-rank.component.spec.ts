import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueRankComponent } from './rescue-rank.component';

describe('RescueRankComponent', () => {
  let component: RescueRankComponent;
  let fixture: ComponentFixture<RescueRankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescueRankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
