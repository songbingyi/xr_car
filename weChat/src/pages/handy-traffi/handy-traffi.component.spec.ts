import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandyTraffiComponent } from './handy-traffi.component';

describe('HandyTraffiComponent', () => {
  let component: HandyTraffiComponent;
  let fixture: ComponentFixture<HandyTraffiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandyTraffiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandyTraffiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
