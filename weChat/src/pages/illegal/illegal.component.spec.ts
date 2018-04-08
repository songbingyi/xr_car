import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Illegal } from './illegal';

describe('Illegal', () => {
  let component: Illegal;
  let fixture: ComponentFixture<Illegal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Illegal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Illegal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
