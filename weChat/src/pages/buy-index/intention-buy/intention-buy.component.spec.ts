import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionBuyComponent } from './intention-buy.component';

describe('IntentionBuyComponent', () => {
  let component: IntentionBuyComponent;
  let fixture: ComponentFixture<IntentionBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
