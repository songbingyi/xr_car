import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueDetailComponent } from './rescue-detail.component';

describe('RescueDetailComponent', () => {
  let component: RescueDetailComponent;
  let fixture: ComponentFixture<RescueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescueDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
