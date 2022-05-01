import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgeListComponent } from './lodge-list.component';

describe('LodgeListComponent', () => {
  let component: LodgeListComponent;
  let fixture: ComponentFixture<LodgeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
