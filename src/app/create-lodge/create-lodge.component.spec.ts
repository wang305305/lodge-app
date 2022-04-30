import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLodgeComponent } from './create-lodge.component';

describe('CreateLodgeComponent', () => {
  let component: CreateLodgeComponent;
  let fixture: ComponentFixture<CreateLodgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLodgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLodgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
