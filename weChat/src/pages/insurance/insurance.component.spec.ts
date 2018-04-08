import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Insurance } from './insurance';

describe('Insurance', () => {
  let component: Insurance;
  let fixture: ComponentFixture<Insurance>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Insurance ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Insurance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
