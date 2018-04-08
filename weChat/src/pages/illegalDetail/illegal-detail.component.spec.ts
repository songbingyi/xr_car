import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllegalDetail } from './illegalDetail';

describe('IllegalDetail', () => {
  let component: IllegalDetail;
  let fixture: ComponentFixture<IllegalDetail>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllegalDetail ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllegalDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
