import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgeDetailComponent } from './lodge-detail.component';

describe('LodgeDetailComponent', () => {
  let component: LodgeDetailComponent;
  let fixture: ComponentFixture<LodgeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
