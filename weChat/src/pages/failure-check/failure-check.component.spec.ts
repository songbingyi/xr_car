import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureCheckComponent } from './failure-check.component';

describe('FailureCheckComponent', () => {
  let component: FailureCheckComponent;
  let fixture: ComponentFixture<FailureCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailureCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
