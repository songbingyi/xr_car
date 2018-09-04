import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyIndexComponent } from './buy-index.component';

describe('BuyIndexComponent', () => {
  let component: BuyIndexComponent;
  let fixture: ComponentFixture<BuyIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
